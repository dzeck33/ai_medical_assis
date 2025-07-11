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

type messages={
    role : string;
    text: string;

}

function MedicalVoiceAgent() {
    const { sessionId } = useParams();
    const [sessionDetail, setsessionDetail] = useState<SessionDetail>();
    const [callStarted, setCallStarted] = useState(false);
    const [vapiInstance, setVapiInstance] = useState<any>();
    const [currentRoll, setCurrentRoll] = useState<string | null>();
    const [liveTranscripts, setLiveTranscripts] = useState<string>();
    const [messages, setMessages] = useState<messages[]>([]);

    useEffect(() => {
        sessionId && getSessionDetails();
    }, [sessionId]);    
    
    const getSessionDetails = async () => {
        const response = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
        console.log("Session detail response:", response.data);
        setsessionDetail(response.data);
    };
    
    const StartCall = async () => {
        const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
        setVapiInstance(vapi);
        // only when you start the call, you start the voice assistant
        vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID!);
        // Listen for events
        vapi.on('call-start', () => {console.log('Call started')
            setCallStarted(true);
        });
        vapi.on('call-end', () => {
            setCallStarted(false);
            console.log('Call ended')
        });
        vapi.on('message', (message) => {
            console.log('Message received:', message);
            if (message.type === 'transcript') {
                const {role, transcriptType,transcript} = message;
                console.log(`${message.role}: ${message.transcript}`);
                if(transcriptType === 'partial') {
                    setLiveTranscripts(transcript);
                    setCurrentRoll(role);
                }
                else if(transcriptType === 'final') {
                    setMessages((prev:any) => [
                        ...prev,
                        { role, text: transcript }
                    ]);
                    setLiveTranscripts("");
                    setCurrentRoll(role);
                }
            }
        });

        vapiInstance.on('speech-start', () => {
            console.log('Assistant started speaking');
            setCurrentRoll('assistant_roll');
        });

        vapiInstance.on('speech-end', () => {
        console.log('Assistant stopped speaking');
            setCurrentRoll('user_roll');
        });

    }

    const endCall = async () => {
        if(!vapiInstance)return;

        vapiInstance.stop();
        vapiInstance.off('call-start');
        vapiInstance.off('call-end');
        vapiInstance.off('message');
        
        setCallStarted(false);
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
                    <div className="overflow-y-auto mt-10 flex flex-col items-center px-10 md:px-28 lg:px-40 xl:px-60">
                        {
                            messages?.slice(-4).map((msg : messages, index) => (
                                <div>
                                    <h2 key={index} className={`text-sm ${msg.role === 'user_roll' ? 'text-blue-500' : 'text-green-500'}`}>
                                        {msg.role}: {msg.text}
                                    </h2>
                                </div>
                            ))
                        }

                        {liveTranscripts && liveTranscripts?.length>0 && <h2 className="text-lg">{currentRoll} : {liveTranscripts}</h2>}
                    </div>
                    {!callStarted?
                        <Button className=" mt-12" onClick={StartCall} disabled={callStarted}>
                        Start Call 📞
                        </Button>:
                        <Button className=" mt-12" variant={"destructive"} onClick={endCall}>
                        <PhoneOff/> End Call
                        </Button>
                    }
                </div>
            )}
        </div>
    );
}

export default MedicalVoiceAgent;
