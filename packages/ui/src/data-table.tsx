import Link from "next/link";
import type { ReactNode } from "react";

export interface Column<Row> {
  header: string;
  /** Width in px. Leave it out on the one column that should take the slack. */
  width?: number;
  cell: (row: Row) => ReactNode;
}

export function DataTable<Row>({
  rows,
  columns,
  gap,
  rowKey,
  rowHref,
  onRowClick,
  unread,
  empty,
}: {
  rows: Row[];
  columns: Column<Row>[];
  /** Space between columns, in px. 48 or 52 depending on the design. */
  gap: number;
  rowKey: (row: Row) => string;
  /** Give one of these to make rows clickable. */
  rowHref?: (row: Row) => string;
  onRowClick?: (row: Row) => void;
  /** Rows that return true get the dot in the top-left corner. */
  unread?: (row: Row) => boolean;
  empty: string;
}) {
  if (rows.length === 0) {
    return <p className="px-sm py-md text-body-sm text-grey-500">{empty}</p>;
  }

  return (
    <div className="flex flex-col gap-xs">
      <div
        style={{ gap }}
        className="type-overline flex h-8.75 items-center bg-grey-50 px-sm tracking-[0.24px] text-grey-500"
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

      {rows.map((row) => {
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
                className={`flex items-center text-body-sm/[normal] text-grey-800 ${
                  column.width ? "flex-none" : "min-w-0 flex-1"
                }`}
              >
                {column.cell(row)}
              </span>
            ))}
          </>
        );

        const className = `relative flex items-center rounded-md px-sm py-2.5 ${
          rowHref || onRowClick
            ? "cursor-pointer text-left hover:bg-grey-50"
            : ""
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
      })}
    </div>
  );
}
