import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@tabler/icons-react';
import React from 'react';

export type doctorAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
    voiceId?: string;
}
type props = {
    doctorAgent: doctorAgent
}

function DoctorAgentCard({doctorAgent}: props) {
    return (
        <div > 
            <img src={doctorAgent.image} alt={doctorAgent.specialist} width={200} height={300} className='w-full h-[250px] object-cover rounded-xl'/>
            <h2 className='text-lg font-semibold mt-2'>
                {doctorAgent.specialist}
            </h2>
            <p className='line-clamp-2 text-sm mt-1 text-gray-500'>
                {doctorAgent.description}
            </p>
            <Button className='w-full mt-4 text-white'>
                Start Consultation <IconArrowRight/>
            </Button> 
        </div>
    );
}
export default DoctorAgentCard;