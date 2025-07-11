"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
type SessionDetail = {
    Id: number;
    notes: string;
    sessionId: string;
    createdBy: string;
    report?: JSON;
    selectedDoctor:doctorAgent;
    createdOn: string;
    conversation?: any;
};

function MedicalVoiceAgent() {
    const { sessionId } = useParams();
    const [sessionDeatil, setsessionDeatil] = useState<SessionDetail>();
    useEffect(() => {
        sessionId &&  getSessionDetails();
    }, [sessionId]);
    
    const getSessionDetails = async () => {
        const response =await axios.get(`/api/session-chat?sessionId=${sessionId}`);
        console.log(response.data);
        setsessionDeatil(response.data);
    }
 
    return (
        <div>
            {sessionId}
        </div>
    );
}
export default MedicalVoiceAgent;