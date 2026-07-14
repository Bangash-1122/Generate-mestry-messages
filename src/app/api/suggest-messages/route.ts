import {
    OpenAIStream,
    StreamingTextResponse
} from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

//Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const prompt = "Create al list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social mesaging platform, like Qooh.me, and should be suitable for a divers audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'what's a hobby you've recently started? || What's a simple thing that makes you happy?' .Ensure the questions are  intriguing, foster curiosity, and  Contribute to a positive and welcoming conversational enviroment."

        const response = await OpenAI.completions.create({
            model: "openai/gpt-5.5",
            max_tokens: 400,
            strem: true,
            prompt,
        });

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    }
    catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error
            return NextResponse.json({
                name, status, headers, message
            }, { status })
        } else {
            console.error("An unexpected error occured ", error)
            throw error
        }
    }
}