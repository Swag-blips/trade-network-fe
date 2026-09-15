import {
  Building05Icon,
  WarehouseIcon,
  Store02Icon,
  BankIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export interface RoleOption {
  value: string;
  label: string;
  description: string;
  icon: IconSvgElement;
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Manages suppliers, distributors, and trade activity",
    icon: Building05Icon,
  },
  {
    value: "supplier",
    label: "Supplier",
    description: "Supplies goods, manages orders, and accesses financing",
    icon: WarehouseIcon,
  },
  {
    value: "distributor",
    label: "Distributor",
    description: "Buys and distributes goods while managing trade and funding needs.",
    icon: Store02Icon,
  },
  {
    value: "capital-provider",
    label: "Capital Provider",
    description: "Funds verified opportunities and monitors portfolio performance.",
    icon: BankIcon,
  },
];

export function roleLabel(value: string): string {
  return ROLE_OPTIONS.find((role) => role.value === value)?.label ?? "Member";
}
