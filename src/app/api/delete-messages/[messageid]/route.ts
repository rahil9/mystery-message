import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "@/model/User";
// import mongoose from "mongoose";

export async function DELETE(request:Request, { params }: { params: {messageid: string}}) {

    const messageID = params.messageid
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session || !user) {
        return Response.json({
            success: false,
            message: 'Not Authenticated'
        }, {status: 401})
    }

    try {
        const updateResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageID}}}
        )
        if (updateResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: 'Message not found or already deleted'
            }, {status: 404})
        }
        return Response.json({
            success: true,
            message: 'Message deleted'
        }, {status: 200})

    } catch (error) {
        console.log("Error in deleting message route", error);
        
        return Response.json({
            success: false,
            message: 'Error deleting message'
        }, {status: 500})
    }

}