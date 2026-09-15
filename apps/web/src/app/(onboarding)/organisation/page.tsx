import { Suspense } from "react";
import { OrganisationForm } from "./components/organisation-form";

export default function OrganisationPage() {
  return (
    <Suspense>
      <OrganisationForm />
    </Suspense>
  );
}
