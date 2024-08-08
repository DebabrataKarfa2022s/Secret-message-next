import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";


export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id:'credentials',
            name:'Credentials',
            credentials: {
                email: {label: 'email', type: 'text'},
                password: {label: 'Password', type: 'password'},
            },
            async authorize(credentials :any) :Promise<any> {
                console.log("credentials : ", credentials)
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or : [{email:credentials.Identifier},{username:credentials.Identifier}]
                    })

                    if(!user){
                        throw new Error('No user found with this email');
                    }

                    if(!user.isVerified){
                        throw new Error('Please verify your email');
                    }

                    const isPasswordCorrect :boolean = await bcrypt.compare(credentials.password, user.password);

                    if(isPasswordCorrect){
                        return user;
                    }
                    else{
                        throw new Error('Incorrect Password')
                    }
                } catch (err:any) {
                    throw new Error("error in authorize" ,err);
                }

            }
})

    ],
    callbacks:{
        async jwt({token,user}){

            if(user){
                token._id= user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username= user.username;
            }

            return token;
        },

        async session({session,token}){
            if(token){
                session.user._id= token._id;
                session.user.isVerified= token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username= token.username;
            }
            return session;
        }
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET,
    pages:{
        signIn:"/sign-in"
    }

}