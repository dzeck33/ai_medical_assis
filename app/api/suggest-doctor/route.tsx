import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";

export async function POST(req: NextRequest) {
    const {notes}= await req.json();
    try{
      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          {
            role: "system",
            content: `
      You are a medical assistant AI. Use the provided doctor agent list to match user symptoms to appropriate doctors.
      Return results in a clean JSON array format.
      Each item must include: id, speacialist, description, image and agentPrompt
      Do not include any explanation or markdown (e.g., no \`\`\`json).
      Here is the list of available doctor agents:
      ${JSON.stringify(AIDoctorAgents)}
            `.trim()
          },
          {
            role: "user",
            content: `
      User Notes/Symptoms:
      ${notes}
      
      Based on the above symptoms, return the most relevant doctors.
      
      Return strictly in the following JSON format:
      
          [
        {
          "id": 1,
          "specialist": "Cardiologist",
          "description": "Expert in diagnosing and treating heart-related symptoms.",
          "image": "/doctor1.png",
          "agentPrompt": "Analyze for chest pain, shortness of breath, and other cardiovascular signs.",
          "voiceId": "will",
        },
        {
          "id": 2,
          "specialist": "General Physician",
          "description": "Handles general health concerns and directs patients to specialists if needed.",
          "image": "/doctor2.png",
          "agentPrompt": "Initial assessment for fever, fatigue, and common ailments.",
          "voiceId": "chris",
        }
      ]

            `.trim()
          }
        ]
      });
      
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
