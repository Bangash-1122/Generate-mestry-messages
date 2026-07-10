import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { Message } from '@/model/UserModel'
import { errorMonitor } from "events";

export async function POST(request: Request){
    await dbConnect()

    const { username, content} = await request.json()
    try {
        const user =  await UserModel.findOne({username})
        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "user not Found"
                },
                { status : 404 }
            )
        }

        // is user accepting the messages
        if(!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "user is not accepting the messages"
                },
                { status : 403 }
            )
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "message sent successfully"
            },
            { status : 200 }
        )
    } catch (error) {
        console.error("Error adding Messages: ", error)
            return Response.json(
                {
                    success: false,
                    message: "Internal server error"
                },
                { status : 500 }
        )
    }
}