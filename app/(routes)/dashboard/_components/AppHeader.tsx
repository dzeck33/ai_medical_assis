import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const MenuOptions = [
    {
        id:1,
        name : "Home",
        path : "/Home"
    },
    {
        id:2,
        name : "History",
        path : "/History"
    },
    {
        id:3,
        name : "Pricing",
        path : "/Pricing"
    },
    {
        id:4,
        name : "Profile",
        path : "/Profile"
    }
];
function AppHeader() {
    return (
        <div className="flex justify-between items-center p-4 shadow px-10 md:px-20 lg:px-40">
            <Image src="/logo.svg" alt="Logo" width={180} height={90} />
            <div className="hidden md:flex gap-12 items-center">
                {MenuOptions.map((option,index) =>(
                    <div key={index}>
                        <h2 className="text-lg font-semibold text-gray-700 hover:text-blue-500 transition-colors cursor-pointer">
                            {option.name}
                        </h2>
                    </div>
                ))}
            </div>
            <UserButton/>
        </div>
    );
}
export default AppHeader;