export function MatchBadge({
  match,
  size = "md",
}: {
  match: number;
  size?: "sm" | "md";
}) {
  const tone =
    match >= 80
      ? "bg-green-500"
      : match >= 60
        ? "bg-ochre-700"
        : "bg-destructive";

  return (
    <span
      className={`flex-none rounded-lg px-xs py-0.5 font-sans font-medium text-white ${tone} ${
        size === "sm" ? "text-[0.625rem]/[normal]" : "text-caption/[normal]"
      }`}
    >
      {match}% match
    </span>
  );
}
