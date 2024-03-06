import { auth } from "@/auth";
import { db } from "../lib/db";
import { decrementAvailableCount, getAvailableCount } from "../lib/user-limit";
import UpgradeButton from "@/components/upgrade-button";
import { checkSubscription } from "../lib/subscription";
import ManageSubscription from "@/components/manage-subscription";

export default async function Private() {
  const session = await auth();

  if (!session?.user) {
    return <div>Not logged in</div>;
  }

  const availableCount = await getAvailableCount();
  const isSubscribed = await checkSubscription();

  return (
    <main>
      <div>
        Private payment
        <p>Queries left : {availableCount}</p>
        <form action={decrementAvailableCount}>
          <button type="submit">Use api</button>
        </form>
        {isSubscribed ? <ManageSubscription /> : <UpgradeButton />}
      </div>
    </main>
  );
}
