import { Suspense } from "react";
import { FundingMandateForm } from "./components/funding-mandate-form";

export default function FundingMandatePage() {
  return (
    <Suspense>
      <FundingMandateForm />
    </Suspense>
  );
}
