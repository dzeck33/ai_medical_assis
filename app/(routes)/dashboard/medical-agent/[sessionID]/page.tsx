"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle } from "lucide-react";
import Image from "next/image";

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

    useEffect(() => {
        sessionId && getSessionDetails();
    }, [sessionId]);

    const getSessionDetails = async () => {
        const response = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
        console.log("Session detail response:", response.data);
        setsessionDetail(response.data);
    };

    return (
        <div>
            <div className="flex items-center justify-between gap-3 p-5 ">
                <h2 className="p-1 px-2 border rounded-md flex items-center gap-2">
                    <Circle className="h-4 w-4" />
                    Not Connected
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
                </div>
            )}
        </div>
    );
}

export default MedicalVoiceAgent;
