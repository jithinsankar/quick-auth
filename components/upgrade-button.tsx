"use client";
import { stripeRedirect } from "@/app/lib/stripe-redirect";
import { useFormState } from "react-dom";

export default function UpgradeButton() {
  const [state, dispatch] = useFormState(stripeRedirect, null);
  if (state?.data) {
    window.location.href = state.data;
  }
  return (
    <div>
      <form action={dispatch}>
        <button>Upgrade Account</button>
      </form>
    </div>
  );
}
