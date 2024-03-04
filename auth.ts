import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import { db } from "./app/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const { handlers: { GET, POST }, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Discord], callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.isSubscribed = false;
            }
            return session
        },
        async jwt({ token, user }) {
            const dbUser = await db.user.findFirst({
                where: {
                    email: token.email
                }
            })
            if (!dbUser) {

                console.log("User not found in db!")

                return null
            }

            return {
                name: token.name,
                email: token.email,
                image: token.image,
                isSubscribed: dbUser.isSubscribed,
            }
        }
    }
})