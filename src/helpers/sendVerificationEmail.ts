// import { resend } from "@/lib/resend";
// import { ApiResponse } from "@/types/ApiResponse";
// import VerificationEmail from "../../emails/VerificationEmail";

// export async function sendVerificationEmail(
//     email:string,
//     username:string,
//     verifyCode: string,
//     ) : Promise<ApiResponse> {
//         try {
//             await resend.emails.send({
//                 from :'  Acme <onboarding@resend.dev>',
//                 to: email,
//                 subject: "Mystery Message Verification Code",
//                 react: VerificationEmail({username, otp:verifyCode})
//             });
//             return {
//                 success:true,
//                 message:"Verification email sent successfully done"
//             }
//         } catch (emailError) {
//             console.log("Error sending verification email : ", emailError);
//             return { success:false, message: "Error sending verification email" };
//         }
    
// }



import transporter from '@/lib/nodeMailer';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        // Correctly generate the email HTML content
        // const emailHtml = render(<VerificationEmail username={username} otp={verifyCode} />);

        const mailOptions = {
            from:{
                name:"Mystery Message",
                address:"dkarfa77@gmail.com"
                // process.env.MAIL_USERNAME
            },
            to: email,
            subject: 'Mystery Message Verification Code',
            html:`
                <h1>Hello ${username}</h1>
                <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
                <STRONG >Here's your verification code: ${verifyCode}</STRONG>
                <p className="text-sm text-red-500">If you did not sign up for Mystery Message, please ignore this email.</p>
                
                <p >Thank you for using Mystery Message.</p>
            `
        };

        // Send the email using Nodemailer
        await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: 'Verification email sent successfully.'
        };
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return { success: false, message: 'Error sending verification email.' };
    }
}
