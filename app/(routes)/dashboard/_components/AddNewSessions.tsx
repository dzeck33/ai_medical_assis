"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2, Loader2Icon } from "lucide-react";
import axios from "axios";
import DoctorAgentCard, { doctorAgent } from "./DoctorAgentCard";
import SuggestDoctorCard from "./SuggestDoctorCard";

function AddNewSessions() {
    const [note,setnote]=useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [suggestedDoctor, setSuggestedDoctor] = useState<doctorAgent[]>();
    const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();

    const OnClickNext = async () => {
        setLoading(true);
        const result = await axios.post("/api/suggest-doctor", {
            notes: note,
        });
        console.log(result.data);
        setSuggestedDoctor(result.data);
        setLoading(false);
    };
    const onStartConsultation = () => {
        // save in db
    };

    return (
        <Dialog>
            <DialogTrigger>
            <Button className="mt-3 ">
                        +Consult A Doctor
            </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription asChild>
                        {!suggestedDoctor ? 
                        <div>
                            <h2>
                                Add Symptoms, Medical History, and Other Details
                                <Textarea placeholder="Add Detail here..." className="h-[200px] mt-1.5" onChange={(e)=> setnote(e.target.value)}/>
                            </h2>
                        </div>:
                        <div>
                            <h2 className="text-lg font-semibold mb-4">
                                Suggested Doctors based on your symptoms
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Display suggested doctors */}
                                {suggestedDoctor?.map((doctor,index)=>(
                                    <SuggestDoctorCard key={index} doctorAgent={doctor}
                                     setSelectedDoctor={() => {
                                        setSelectedDoctor(doctor);
                                     }}
                                    />

                                ))}
                            </div>
                        </div>
                        }
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose>
                        <Button type="button" className="ml-2" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    {!suggestedDoctor ?
                    <Button disabled={!note || loading} onClick={OnClickNext} className="ml-2">
                        {loading && <Loader2 className='animate-spin' />}
                        Next <ArrowRight/>
                    </Button>:
                    <Button onClick={() => {
                        onStartConsultation();
                    }}>
                        Start Consultation
                    </Button>
                    }
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}

export default AddNewSessions;