import React from "react";
import { doctorAgent } from "./DoctorAgentCard";
import Image from "next/image";

type props = {
    doctorAgent: doctorAgent,
    setSelectedDoctor:any
}

function SuggestDoctorCard({doctorAgent,setSelectedDoctor }: props) {
    return (
        <div className='flex flex-col items-center p-5 border rounded-lg shadow-sm hover:border-blue-600 cursor-pointer transition-all' onClick={()=>setSelectedDoctor(doctorAgent)}>
            <Image src={doctorAgent.image} alt={doctorAgent.specialist} width={70} height={70} className="h-[50px] w-[50px] rounded-4xl: object-cover"  />
            <h2 className='text-lg font-semibold mt-2 text-center'>
                {doctorAgent.specialist}
            </h2>
            <p className='line-clamp-2 text-sm mt-1 text-gray-500 text-center'>
                {doctorAgent.description}
            </p>
        </div>
    );
}

export default SuggestDoctorCard;