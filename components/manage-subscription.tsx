"use client";
import { stripeRedirect } from "@/app/lib/stripe-redirect";
import { useFormState } from "react-dom";

export default function ManageSubscription() {
  const [state, dispatch] = useFormState(stripeRedirect, null);
  if (state?.data) {
    window.location.href = state.data;
  }
  return (
    <div>
      <form action={dispatch}>
        <button>Manage Account</button>
      </form>
    </div>
  );
}
