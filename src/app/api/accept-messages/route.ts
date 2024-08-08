import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";



export async function POST (request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user : User = session?.user

    if(!session || !session.user){
        return Response.json({
            success:false,
            message: "not authenticated"
        },{
            status:401
        })
    }

    const userId= user._id;
    const {acceptMessages} = await request.json()

    try {
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage:acceptMessages
        },
        {new:true}
    )

    if(!updateUser){
        // user not found 
        return Response.json({
            success:false,
            message: "unable to find user to update message accepting status"
        },{
            status:404
        })
    }

    // successfully update message acceptance status 
    return Response.json({
        success: true,
        message:"message acceptance status update successfully",
        updateUser
    },{status:200})
    } catch (error) {
        console.error("Error updating message acceptance status : ", error);
        return Response.json({
            success:false,
            message: "error updateing acceptace status"
        },{
            status:500
        })
    }



}

export async function GET (request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user : User = session?.user

    if(!session || !session.user){
        return Response.json({
            success:false,
            message: "not authenticated"
        },{
            status:401
        })
    }

    try {
        const foundUser = await UserModel.findById(user._id);

        if(!foundUser){
            // user not found 
            return Response.json({
                success: false,
                message:"user not found"
            },{status:404})
        }

        // return the user's message acceptance status 
        return Response.json({
            success:true,
            isAcceptingMessages:foundUser.isAcceptingMessage
        },{status:200})
    } catch (error) {
        console.error("error retriveing message acceptance staus : ", error);
        return Response.json({
            success:false,
            message:"Error retriveing message acceptace status"
        },{status:500})
    }
}