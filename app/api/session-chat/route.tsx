import {db} from "@/config/db";
import {sessionChatTable} from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid";
export async function POST(req: NextRequest) {
    const {notes,selectedDoctor} = await req.json();
    const user =await currentUser();
    try{
        const sessionId = uuidv4();
        const result = await db.insert(sessionChatTable).values({
            sessionId,
            createdBy: user?.primaryEmailAddress?.emailAddress || "",
            notes,
            selectedDoctor,
            createdOn: new Date().toISOString(),
            //@ts-ignore
        }).returning({sessionChatTable});
        return NextResponse.json(result[0]?.sessionChatTable);
    }
    catch(err){
        return NextResponse.json(err);
    }
}