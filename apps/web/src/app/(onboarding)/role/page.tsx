import { RoleSelection } from "./components/role-selection";

export default async function RolePage({
  searchParams,
}: {
  searchParams: Promise<{ firstName?: string }>;
}) {
  const { firstName } = await searchParams;

  return <RoleSelection firstName={firstName ?? ""} />;
}
