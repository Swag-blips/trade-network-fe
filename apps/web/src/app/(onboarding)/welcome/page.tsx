import { Suspense } from "react";
import { WelcomeMessage } from "./components/welcome-message";

export default function WelcomePage() {
  return (
    <Suspense>
      <WelcomeMessage />
    </Suspense>
  );
}
