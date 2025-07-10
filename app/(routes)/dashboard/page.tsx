import React from "react";
import HistoryList from "./_components/HistoryList";
import { Button } from "@/components/ui/button";
import DoctorAgentList from "./_components/DoctorAgentList";
import AddNewSessions from "./_components/AddNewSessions";

function Dashboard(){
    return (
        <>
            <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                    My Dashboard
                </div>
                <AddNewSessions />
            </div>
            <HistoryList />
            <DoctorAgentList />
        </>
    );
}
export default Dashboard;