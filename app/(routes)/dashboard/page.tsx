import React from "react";
import HistoryList from "./_components/HistoryList";
import { Button } from "@/components/ui/button";
import DoctorAgentList from "./_components/DoctorAgentList";

function Dashboard(){
    return (
        <>
            <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                    My Dashboard
                </div>
                <Button>
                    +Consult A Doctor
                </Button>
            </div>
            <HistoryList />
            <DoctorAgentList />
        </>
    );
}
export default Dashboard;