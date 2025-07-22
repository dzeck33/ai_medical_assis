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
    report: JSON;
    selectedDoctor: doctorAgent;
    createdOn: string;
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
        console.log("Session detail response:", response);
        setsessionDetail(response.data);
    };
    
    const StartCall = async () => {
        // setLoading(true);
        const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
        setVapiInstance(vapi);
        // only when you start the call, you start the voice assistant
        // Listen for events

        const VapiConfig = {
            name:'AI Medical Agent',
            firstMessage:"Hi there! I am your AI Medical Agent. How can I assist you today?",
            transcriber:{
                provider:'assembly-ai',
                language:'en'
            },
            voice:{
                provider:'playht',
                voiceId: sessionDetail?.selectedDoctor?.voiceId ?? 'will',
            },
            model:{
                provider:'openai',
                model:'gpt-4.1-nano',
                messages:[
                    {
                        role:'system',
                        content:sessionDetail?.selectedDoctor?.agentPrompt || "You are a helpful AI medical agent. Ask questions and provide advice based on the user's responses."
                    }
                ]
            }
        };
        
        console.log("Starting Vapi with config:", VapiConfig);
        // @ts-ignore
        vapi.start(VapiConfig);

        vapi.on('call-start', () => {console.log('Call started', sessionDetail?.selectedDoctor?.voiceId);
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

        vapi.on('speech-start', () => {
            console.log('Assistant started speaking');
            setCurrentRoll('assistant_roll');
        });

        vapi.on('speech-end', () => {
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
                    <div className="overflow-y-auto mt-10 flex flex-col gap-4 px-6 md:px-28 lg:px-40 xl:px-60 w-full">
                        {/* Previous messages */}
                        {messages?.slice(-4).map((msg: messages, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] text-sm md:text-base leading-relaxed
                                        ${msg.role === 'user' 
                                            ? 'text-blue-800 bg-blue-50 rounded-lg px-4 py-2' 
                                            : 'text-gray-800 bg-gray-100 rounded-lg px-4 py-2'}`}
                                >
                                    <span className="block font-semibold mb-1">
                                        {msg.role === 'user' ? 'You' : 'Agent'}
                                    </span>
                                    <span>{msg.text}</span>
                                </div>
                            </div>
                        ))}

                        {/* Live transcription */}
                        {liveTranscripts && liveTranscripts.length > 0 && (
                            <div
                                className={`flex ${currentRoll === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] text-sm md:text-base font-medium italic
                                        ${currentRoll === 'user' 
                                            ? 'text-blue-600 text-right' 
                                            : 'text-green-700 text-left'}`}
                                >
                                    <span className="block font-semibold not-italic">
                                        {currentRoll === 'user' ? 'You' : 'Agent'}
                                    </span>
                                    {liveTranscripts}
                                </div>
                            </div>
                        )}
                    </div>

                    {!callStarted?
                        <Button
                            className={`mt-12 transition-transform duration-150 active:scale-95 ${callStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={StartCall}
                            disabled={callStarted}
                        >
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



