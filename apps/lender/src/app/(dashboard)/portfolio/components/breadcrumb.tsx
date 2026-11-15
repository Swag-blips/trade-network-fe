import Link from "next/link";

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-md text-body/[normal]">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-md">
            {index > 0 ? (
              <span aria-hidden className="text-grey-400">
                /
              </span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="text-grey-500 transition-colors hover:text-grey-800 motion-reduce:transition-none"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-grey-800">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
