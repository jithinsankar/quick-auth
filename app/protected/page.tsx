import { auth } from "@/auth";

export default async function Protected() {
  const session = await auth();

  if (!session?.user.isSubscribed) {
    return <div>Not subbed</div>;
  }

  return <main>Protected</main>;
}
