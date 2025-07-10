import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";

export async function POST(req: NextRequest) {
    const {notes}= await req.json();
    try{
        const completion = await openai.chat.completions.create({
            model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
            messages: [
                { role: "system", content: JSON.stringify(AIDoctorAgents) },
              { role: "user", content: "User Notes/Symptoms" + notes+"Depending on the User notes and symptoms,Please Suggest list of doctors, Return object in JSON only" },
            ],
          })
        const rawResponse = completion.choices[0].message;
        //@ts-ignore
        const resp=rawResponse.content.trim().replace('```json', '').replace('```', '');
        const JSONResponse = JSON.parse(resp);
        return NextResponse.json(JSONResponse);
    }
    catch (error) {
        return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
    }
}
