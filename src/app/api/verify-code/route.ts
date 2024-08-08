import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";


export async function POST(request : Request){

    await dbConnect();

    try {
        const {username, code} = await request.json();
        const decodedUsername= decodeURIComponent(username)


        const user = await UserModel.findOne({username:decodedUsername});

        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{
                status:404
            })
        }

        // check if the code is correct and not expired 
        const isCodeValid = user.verifyCode ===code;
        const isCodeNotExpired = new Date(user.verifycodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            //* update the user's verification status 
            user.isVerified=true;
            await user.save();

            return Response.json({
                success:true,
                message:"Account verified successfully"
            },{
                status:200
            })

        }else if(!isCodeNotExpired){
            // code has expired 
            return Response.json({
                success:false,
                message:"Code expired. Please sign up again to get the new code"
            },{
                status:400
            })
        }else{
            // code is incorrect 
            return Response.json({
                success:false,
                message:"Incorrect code. Please try again"
            },{
                status:400
            })
        }



    } catch (error) {
        console.error("Error verifying user : ", error);
        return Response.json({
            success:false,
            message:"Error verifying user"
        },{
            status:500
        })
    }
}