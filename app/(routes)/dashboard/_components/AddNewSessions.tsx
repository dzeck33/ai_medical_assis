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

function AddNewSessions() {
    const [note,setnote]=useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [suggestedDoctor, setSuggestedDoctor] = useState<doctorAgent[]>();
    const OnClickNext = async () => {
        setLoading(true);
        const result = await axios.post("/api/suggest-doctor", {
            notes: note,
        });
        console.log(result.data);
        setSuggestedDoctor(result.data);
        setLoading(false);
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
                    <DialogTitle>Add Basic Details</DialogTitle>
                    <DialogDescription asChild>
                        { !suggestedDoctor ?
                        <div>
                            <h2>
                                Add Symptoms, Medical History, and Other Details
                                <Textarea placeholder="Add Detail here..." className="h-[200px] mt-1.5" onChange={(e)=> setnote(e.target.value)}/>
                            </h2>
                        </div>:
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Display suggested doctors */}
                            {suggestedDoctor.map((doctor,index)=>(
                                <DoctorAgentCard doctorAgent={doctor} key={index} />
                            ))}
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
                    {!suggestedDoctor?
                    <Button disabled={!note} onClick={OnClickNext} className="ml-2">
                        {loading && <Loader2 className='animate-spin' />}
                        Next <ArrowRight/>
                    </Button>:
                    <Button>
                        Start Consultation
                    </Button>
                    }
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}

export default AddNewSessions;