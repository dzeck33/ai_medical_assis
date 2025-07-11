"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from '@vapi-ai/web';
type SessionDetail = {
    id: number;
    notes: string;
    sessionId: string;
    createdBy: string;
    report: JSON;
    selectedDoctor: doctorAgent;
    createdOn: string;
    conversation?: any;
};

function MedicalVoiceAgent() {
    const { sessionId } = useParams();
    const [sessionDetail, setsessionDetail] = useState<SessionDetail>();
    const [callStarted, setCallStarted] = useState(false);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    
    useEffect(() => {
        sessionId && getSessionDetails();
    }, [sessionId]);
    
    const getSessionDetails = async () => {
        const response = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
        console.log("Session detail response:", response.data);
        setsessionDetail(response.data);
    };
    
    const StartCall = async () => {
        // only when you start the call, you start the voice assistant
        vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID!);
        // Listen for events
        vapi.on('call-start', () => {console.log('Call started')
            setCallStarted(true);
        });
        vapi.on('call-end', () => {console.log('Call ended')
            setCallStarted(false);
        });
        vapi.on('message', (message) => {
            if (message.type === 'transcript') {
                console.log(`${message.role}: ${message.transcript}`);
            }
        });
    }

    return (
        <div className="p-3 border rounded-lg shadow-md bg-secondary">
            <div className="flex items-center justify-between gap-3 p-5 ">
                <h2 className="p-1 px-2 border rounded-md flex items-center gap-2">
                    <Circle className={`h-4 w-4 rounded-full ${callStarted?`bg-green-400`:`bg-red-400` }`} />
                    {
                    callStarted ? 
                    "Connected..." :
                    "Not Connected"
                    }
                </h2>
                <h2 className="font-bold text-xl text-gray-400">00:00</h2>
            </div>

            {sessionDetail?.selectedDoctor?.image && (
                <div className="p-5 flex items-center flex-col mt-2 gap-3">
                    <Image
                        src={sessionDetail.selectedDoctor.image}
                        alt={sessionDetail.selectedDoctor.specialist ?? ""}
                        width={120}
                        height={120}
                        className="rounded-full object-cover h-[100px] w-[100px]"
                    />
                    <div>
                        <h2 className="font-semibold text-lg">{sessionDetail.selectedDoctor.specialist}</h2>
                        <p className="text-sm text-gray-500">AI Medical Agent</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 mt-30">
                        <h2 className="text-gray-400">Agent Text</h2>
                        <h2 className="text-lg">User Text</h2>
                    </div>
                    {!callStarted?
                        <Button className=" mt-12" onClick={StartCall} disabled={callStarted}>
                        Start Call 📞
                    </Button>:
                        <Button className=" mt-12 bg-red-400" variant={"destructive"}>
                        <PhoneOff/> End Call
                    </Button>
                    }
                </div>
            )}
        </div>
    );
}

export default MedicalVoiceAgent;
