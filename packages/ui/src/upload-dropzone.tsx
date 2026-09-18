"use client";

import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Attachment01Icon, CloudUploadIcon } from "@hugeicons/core-free-icons";
import { IconButton } from "./icon-button";
import { Delete02Icon } from "@hugeicons/core-free-icons";

export function UploadDropzone({
  file,
  onFileChange,
  hint = "PDF, PNG or JPG - Max 10 MB",
  accept = ".pdf,.png,.jpg,.jpeg",
}: {
  file: string | null;
  onFileChange: (file: string | null) => void;
  hint?: string;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function pick() {
    inputRef.current?.click();
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        const dropped = event.dataTransfer.files?.[0];
        if (dropped) onFileChange(dropped.name);
      }}
      className={`w-full overflow-hidden rounded-lg border border-dashed ${
        file
          ? "flex flex-col items-center justify-center gap-xl border-green-200 bg-white p-md"
          : "h-37 border-green-200 bg-green-50"
      } ${dragging ? "border-green-500" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) =>
          onFileChange(event.target.files?.[0]?.name ?? null)
        }
      />

      {file ? (
        <>
          <div className="flex w-full items-center gap-xs rounded-md border border-grey-100 bg-grey-50 px-sm py-xs">
            <span className="flex size-8 flex-none items-center justify-center rounded-full bg-evergreen-100">
              <HugeiconsIcon
                icon={Attachment01Icon}
                size={20}
                className="text-evergreen-700"
              />
            </span>
            <p className="min-w-0 flex-1 truncate text-body text-grey-800">
              {file}
            </p>
            <IconButton
              label="Remove file"
              size="xs"
              onClick={() => onFileChange(null)}
            >
              <HugeiconsIcon icon={Delete02Icon} />
            </IconButton>
          </div>
          <p className="w-full text-center text-body-sm text-grey-500">
            <button
              type="button"
              onClick={pick}
              className="cursor-pointer text-evergreen-600 hover:underline"
            >
              Replace
            </button>{" "}
            or drag and drop file here
          </p>
        </>
      ) : (
        <button
          type="button"
          onClick={pick}
          className="flex size-full cursor-pointer flex-col items-center justify-center gap-md text-center"
        >
          <HugeiconsIcon
            icon={CloudUploadIcon}
            size={32}
            className="text-green-600"
          />
          <span className="flex w-63.25 max-w-full flex-col gap-sm">
            <span className="font-sans text-body/[normal] font-medium text-grey-800">
              Upload proof
            </span>
            <span className="text-body-sm text-grey-500">{hint}</span>
          </span>
        </button>
      )}
    </div>
  );
}
