import Link from "next/link";
import type { ReactNode } from "react";

export interface Column<Row> {
  header: string;
  /** Width in px. Leave it out on the one column that should take the slack. */
  width?: number;
  cell: (row: Row) => ReactNode;
}

const LAYOUT: Record<
  "default" | "cards" | "outlined",
  { root: string; header: string; items?: string; row: string; cell: string }
> = {
  default: {
    root: "flex flex-col gap-xs",
    header: "px-sm text-grey-500",
    row: "rounded-md px-sm py-2.5",
    cell: "text-body-sm/[normal]",
  },
  cards: {
    root: "flex flex-col",
    header: "border-y border-grey-100 px-xl text-grey-500",
    items: "flex flex-col gap-xs px-md py-2.5",
    row: "rounded-xl border border-grey-100 bg-white px-md py-3.5",
    cell: "text-body/[1.4]",
  },
  outlined: {
    root: "flex flex-col overflow-hidden rounded-lg border border-grey-200 bg-white",
    header: "border-b border-grey-100 px-md text-grey-600",
    items: "flex flex-col px-md py-2.5",
    row: "py-3.25",
    cell: "text-body-sm/[normal]",
  },
};

export function DataTable<Row>({
  rows,
  columns,
  gap,
  variant = "default",
  rowKey,
  rowHref,
  onRowClick,
  unread,
  empty,
}: {
  rows: Row[];
  columns: Column<Row>[];
  variant?: keyof typeof LAYOUT;
  /** Space between columns, in px. */
  gap: number;
  rowKey: (row: Row) => string;
  /** Give one of these to make rows clickable. */
  rowHref?: (row: Row) => string;
  onRowClick?: (row: Row) => void;
  /** Rows that return true get the dot in the top-left corner. */
  unread?: (row: Row) => boolean;
  empty: string;
}) {
  const layout = LAYOUT[variant];

  if (rows.length === 0) {
    return <p className="px-sm py-md text-body-sm text-grey-500">{empty}</p>;
  }

  const items = rows.map((row) => {
    const cells = (
      <>
        {unread?.(row) ? (
          <span
            aria-label="Unread"
            className="absolute top-px left-1.75 size-3 rounded-full bg-evergreen-900"
          />
        ) : null}
        {columns.map((column) => (
          <span
            key={column.header}
            style={column.width ? { width: column.width } : undefined}
            className={`flex items-center text-grey-800 ${layout.cell} ${
              column.width ? "flex-none" : "min-w-0 flex-1"
            }`}
          >
            {column.cell(row)}
          </span>
        ))}
      </>
    );

    const className = `relative flex items-center ${layout.row} ${
      rowHref || onRowClick ? "cursor-pointer text-left hover:bg-grey-50" : ""
    }`;

    if (rowHref) {
      return (
        <Link
          key={rowKey(row)}
          href={rowHref(row)}
          style={{ gap }}
          className={className}
        >
          {cells}
        </Link>
      );
    }

    if (onRowClick) {
      return (
        <button
          key={rowKey(row)}
          type="button"
          onClick={() => onRowClick(row)}
          style={{ gap }}
          className={className}
        >
          {cells}
        </button>
      );
    }

    return (
      <div key={rowKey(row)} style={{ gap }} className={className}>
        {cells}
      </div>
    );
  });

  return (
    <div className={layout.root}>
      <div
        style={{ gap }}
        className={`type-overline flex h-8.75 items-center bg-grey-50 whitespace-nowrap tracking-[0.24px] ${layout.header}`}
      >
        {columns.map((column) => (
          <span
            key={column.header}
            style={column.width ? { width: column.width } : undefined}
            className={column.width ? "flex-none" : "min-w-0 flex-1"}
          >
            {column.header}
          </span>
        ))}
      </div>

      {layout.items ? <div className={layout.items}>{items}</div> : items}
    </div>
  );
}
