"use server"
import { auth } from "@/auth"
import { db } from "./db";
import { revalidatePath } from "next/cache";

export const incrementAvailableCount = async () => {
    const session = await auth();
    if (!session?.user.email) {
        throw new Error("Unauthorized")
    }

    const user = await db.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    if (user) {
        await db.user.update({
            where: {
                email: session.user.email
            },
            data: {
                countLeft: user.countLeft + 1
            }
        })
    }
}
export const decrementAvailableCount = async () => {
    const session = await auth();
    if (!session?.user.email) {
        throw new Error("Unauthorized")
    }

    const user = await db.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    if (user) {
        await db.user.update({
            where: {
                email: session.user.email
            },
            data: {
                countLeft: user.countLeft > 0 ? user.countLeft - 1 : 0
            }
        })
    }

    revalidatePath('/')
}
export const getAvailableCount = async () => {
    const session = await auth();
    if (!session?.user.email) {
        throw new Error("Unauthorized")
    }

    const user = await db.user.findUnique({
        where: {
            email: session.user.email
        }
    })



    if (user) {
        return user.countLeft
    }
    else {
        return 0
    }
}