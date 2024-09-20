import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "@/model/User";
// import mongoose from "mongoose";

export async function GET(request:Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user
    if(!session || !user) {
        return Response.json({
            success: false,
            message: 'Not Authenticated'
        }, {status: 401})
    }
    // const userID = new mongoose.Types.ObjectId(user._id);
    const userID = user._id
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userID } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();
        if(!user || user.length === 0) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, {status: 404})
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        }, {status: 200})
    } catch (error) {
        console.log("Unexpected error occured: ", error);
        return Response.json({
            success: false,
            message: 'User Not Authenticated'
        }, {status: 500})
    }
}