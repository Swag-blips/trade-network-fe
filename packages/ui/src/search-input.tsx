import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label
      className={`flex max-w-full items-center gap-xs overflow-hidden rounded-full border border-grey-200 bg-grey-50 px-sm py-xs focus-within:outline-2 focus-within:outline-evergreen-600 ${className}`}
    >
      <HugeiconsIcon
        icon={Search01Icon}
        size={16}
        className="flex-none text-grey-900"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent font-sans text-body/[normal] font-medium text-grey-900 outline-none placeholder:text-grey-400 [&::-webkit-search-cancel-button]:hidden"
      />
    </label>
  );
}
