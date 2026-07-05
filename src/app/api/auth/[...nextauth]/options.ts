import {AuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';

export const authOptions : AuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    }).select("+password");
                    if(!user){
                        throw new Error("User not found with this identifier");
                    }
                    if(!user.isVerfied){
                        throw new Error("Please verify your account before login");
                    }
                    const isPasswordValid = await bcrypt.compare(credentials?.password || "", user.password);
                    if(isPasswordValid){
                        return user
                    } else{
                        throw new Error("Invalid password");
                    }
                } catch (error:any) {
                    console.error("Error in authentication:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user._id?.toString();
                token.username = user.username;
                token.email = user.email;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
            }
            return session;
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,

}