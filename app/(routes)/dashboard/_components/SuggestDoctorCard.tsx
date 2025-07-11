import React from "react";
import { doctorAgent } from "./DoctorAgentCard";
import Image from "next/image";

type Props = {
    doctorAgent?: doctorAgent;
    setSelectedDoctor?: (doctor: doctorAgent) => void;
    selectedDoctor?: doctorAgent;
};

function SuggestDoctorCard({ doctorAgent, setSelectedDoctor, selectedDoctor }: Props) {
    return (
        <div
            className={`flex flex-col items-center p-5
            border rounded-lg shadow-sm hover:border-blue-600 
            cursor-pointer ${selectedDoctor?.id === doctorAgent?.id ? 'border-blue-500' : ''}`}
            onClick={() => doctorAgent && setSelectedDoctor && setSelectedDoctor(doctorAgent)}
        >
            <Image
                src={doctorAgent?.image || ""}
                alt={doctorAgent?.specialist || ""}
                width={70}
                height={70}
                className="h-[50px] w-[50px] rounded-full object-cover"
            />
            <h2 className="text-lg font-semibold mt-2 text-center">
                {doctorAgent?.specialist}
            </h2>
            <p className="line-clamp-2 text-sm mt-1 text-gray-500 text-center">
                {doctorAgent?.description}
            </p>
        </div>
    );
}

export default SuggestDoctorCard;
