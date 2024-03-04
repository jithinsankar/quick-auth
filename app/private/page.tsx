import { auth } from "@/auth";

export default async function Private() {
  const session = await auth();

  if (!session?.user) {
    return <div>Not logged in</div>;
  }

  return <main>Private</main>;
}
