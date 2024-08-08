import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import bcrypt from "bcryptjs"

export async function POST(request:Request){

    await dbConnect();

    try {
        const {username, email, password} = await request.json();

        const exitingVerifiedUserByUsername= await UserModel.findOne({
            username,
            isVerified:true,
        });

        if(exitingVerifiedUserByUsername){
            return Response.json({
                succuss:false,
                message:"username is already taken"
            },
            {
                status:400
            }
        )
        }
        const exitingUserByEmail= await UserModel.findOne({email});
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(exitingUserByEmail){
            if(exitingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:'User already exits with this email',
                },{
                    status:400
                })
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10);
                
                exitingUserByEmail.password=hashedPassword;
                exitingUserByEmail.verifyCode=verifyCode;
                exitingUserByEmail.verifycodeExpiry= new Date(Date.now() + 3600000);
                await exitingUserByEmail.save();
            }
    
        }
        else{
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser= new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifycodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            });

            await newUser.save();
        }

        //* send verification code 

        const emailResponse = await sendVerificationEmail(email,username,verifyCode);
        console.log("emailResponse : ", emailResponse)
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message,
            },{
                status:500
            })
        }

        return Response.json({
            success:true,
            message: 'user registered successfully . please verify your account '
        },{
            status:201
        })
    } catch (error) {
        console.error("Error registering user : ", error)
        return Response.json({
            success:false,
            message:"Error registering user"
        },{
            status:500
        }
    )
    }
}