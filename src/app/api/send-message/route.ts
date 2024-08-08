import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/user.model";


export async function POST(request: Request) {

    await dbConnect();
    const {username, content} = await request.json();

    try {
       const user = await UserModel.findOne({username}).exec();

       if(!user){
        return Response.json({
            success:false,
            message:'user not found'
        },{
            status:400
        })
       }

    //*    check if the user is accepting message 
    if(!user.isAcceptingMessage){
        return Response.json({
            success:false,
            message:'user is not accepting message'
        },{
            status:403 // forbidden status
        })
    }

    const newMessage = {content, createdAt : new Date()};

    //* push the new message to user's message array

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json({
        success:true,
        message:'message sent successfully'
    },{
        status:201
    })
    } catch (error) {
        console.error("Error in adding message : " , error);
        return Response.json({
            success:false,
            message:"internal server error "
        },{
            status:500
        })
    }





}