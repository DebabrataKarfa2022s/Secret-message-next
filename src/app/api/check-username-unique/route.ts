import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function POST(request: Request) {

    await dbConnect();

    try {
        const {searchParams} = new URL(request.url);

        const queryParams = {
            username: searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParams);
        console.log(result)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json({
                success:false,
                message:usernameErrors?.length>0
                ?usernameErrors.join(', ')
                :"Invalid query parametes"
        },{
            status:400
        })
    }

    const {username} = result.data

    const existingVerifieduser = await UserModel.findOne({username,
        isVerified:true
    })

    if(existingVerifieduser){
        return Response.json({
            success:false,
            message:"username is already taken "
        },{
            status:200
        })
    }

    return Response.json({
        success:true,
        message:"username is unique"
    },{
        status:200
    })
    } catch (error) {
        console.error("Error checking username : " , error);
        return Response.json({
            success:false,
            message:"error checking username "
        },{
            status:500
        })
    }
}