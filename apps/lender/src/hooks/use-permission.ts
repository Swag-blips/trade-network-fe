import { useOrganization } from "./use-organization";

/** For showing or hiding actions only; the API checks every request itself. */
export function usePermission(permission: string) {
  const { data: organization } = useOrganization();
  return organization?.permissions?.includes(permission) ?? false;
}
