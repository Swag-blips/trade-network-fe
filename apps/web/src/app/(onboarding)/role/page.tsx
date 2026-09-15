import { Suspense } from "react";
import { RoleSelection } from "./components/role-selection";

export default function RolePage() {
  return (
    <Suspense>
      <RoleSelection />
    </Suspense>
  );
}
