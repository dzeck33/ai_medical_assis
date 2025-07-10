"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddNewSessions from "./AddNewSessions";
function HistoryList() {
    const [historyList] = useState([]);
    return (
        <div className="mt-10">
            {historyList.length == 0 ? 
                <div className="flex flex-col items-center justify-center p-7 border border-dashed rounded-2xl border-2">
                    <Image src="/medical_assistant.png" alt="Medical Assistant" width={150} height={150} />
                    <h2 className="text-lg font-semibold text-gray-700 mt-4">
                        No Consultation Made
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Start your first consultation with a doctor.
                    </p>
                    <AddNewSessions />
                </div>:
                <div>List of History</div>
            }
        </div>
    );
}
export default HistoryList;