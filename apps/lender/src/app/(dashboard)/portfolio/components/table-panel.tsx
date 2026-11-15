import type { ReactNode } from "react";
import { SearchInput } from "@repo/ui/search-input";
import { Select } from "@repo/ui/select";

export const ANY_STATUS = "Any Status";

export function TablePanel({
  query,
  onQueryChange,
  placeholder,
  status,
  onStatusChange,
  statuses,
  filterLabel,
  children,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder: string;
  status: string;
  onStatusChange: (status: string) => void;
  statuses: string[];
  filterLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-grey-100 bg-white shadow-small-thick">
      <div className="flex items-center justify-between gap-md px-md py-2.5">
        <SearchInput
          value={query}
          onChange={onQueryChange}
          placeholder={placeholder}
          className="w-91.75"
        />
        <Select
          aria-label={filterLabel}
          variant="filter"
          value={status}
          onValueChange={onStatusChange}
          options={[ANY_STATUS, ...statuses]}
        />
      </div>
      {children}
    </div>
  );
}
