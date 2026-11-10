import { Select } from "@repo/ui/select";
import type { MatchLevel } from "../types/opportunity";
import { MATCH } from "../utils/format";

const ALL = "ALL";

const OPTIONS = [
  { value: ALL, label: "All match" },
  ...(Object.keys(MATCH) as MatchLevel[]).map((level) => ({
    value: level,
    label: MATCH[level].label,
  })),
];

export function MatchingPreference({
  value,
  onChange,
}: {
  value?: MatchLevel;
  onChange: (value?: MatchLevel) => void;
}) {
  return (
    <div className="flex flex-none items-center gap-2.5">
      <span className="text-body/[normal] text-grey-600">
        Matching preference:
      </span>
      <Select
        aria-label="Matching preference"
        variant="soft"
        align="end"
        value={value ?? ALL}
        onValueChange={(next) =>
          onChange(next === ALL ? undefined : (next as MatchLevel))
        }
        options={OPTIONS}
      />
    </div>
  );
}
