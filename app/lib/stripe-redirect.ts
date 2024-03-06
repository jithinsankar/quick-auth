"use server"
import { auth } from "@/auth";
import { absoluteUrl } from "./utils";
import { db } from "./db";
import { stripe } from "./stripe";
import { revalidatePath } from "next/cache";

export const stripeRedirect = async () => {
    const session = await auth();

    if (!session?.user.email) {
        return {
            error: "Unauthorized",
        };
    }

    const settingsUrl = absoluteUrl(`/protected`);

    let url = "";

    try {
        const userSubscription = await db.userSubscription.findUnique({
            where: {
                userId: session.user.email
            }
        });

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });

            url = stripeSession.url;
        } else {
            const stripeSession = await stripe.checkout.sessions.create({
                success_url: settingsUrl,
                cancel_url: settingsUrl,
                payment_method_types: ["card"],
                mode: "subscription",
                billing_address_collection: "auto",
                customer_email: session.user.email,
                line_items: [
                    {
                        price_data: {
                            currency: "USD",
                            product_data: {
                                name: "API requests",
                                description: "get 5 requests!"
                            },
                            unit_amount: 2000,
                            recurring: {
                                interval: "month"
                            },
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    userId: session.user.email
                },
            });

            url = stripeSession.url || "";
        }
    } catch {
        return {
            error: "Something went wrong!"
        }
    };

    revalidatePath(settingsUrl);
    return { data: url };
};