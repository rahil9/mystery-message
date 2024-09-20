import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Not Aunticated'
        }, {status: 401})
    }

    const userID = user._id
    const {acceptMessage} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userID, 
            {isAcceptingMessage: acceptMessage},
            {new:true}
        );

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: 'Failed to update user staus to accept messages'
            }, {status: 401})
        }

        return Response.json({
            success: true,
            message: 'Message Acceptance status updated successfully', updatedUser
        }, {status: 200})

    } catch (error) {
        console.log("failed to update user staus to accept messages");
        return Response.json({
            success: false,
            message: 'Failed to update user staus to accept messages'
        }, {status: 500})
    }

}

export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Not Aunticated'
        }, {status: 401})
    }

    const userID = user._id

    try {
        const foundedUser = await UserModel.findById(userID)
        if (!foundedUser) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, {status: 404})
        }
    
        return Response.json({
            success: true,
            isAcceptingMessage: foundedUser.isAcceptingMessage
        }, {status: 200})
    } catch (error) {
        console.log("failed to update user staus to accept messages");
        return Response.json({
            success: false,
            message: 'Error is getting message acceptance status'
        }, {status: 500})
    }

}
