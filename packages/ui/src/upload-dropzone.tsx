"use client";

import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Attachment01Icon,
  CloudUploadIcon,
  Delete02Icon,
  Edit03Icon,
  File02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "./button";
import { IconButton } from "./icon-button";

export type UploadDropzoneVariant = "proof" | "browse";

function fileSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const FRAME: Record<
  UploadDropzoneVariant,
  { empty: string; filled: string; dragging: string }
> = {
  proof: {
    empty: "h-37 rounded-lg border border-dashed border-green-200 bg-green-50",
    filled:
      "flex flex-col items-center justify-center gap-xl rounded-lg border border-dashed border-green-200 bg-white p-md",
    dragging: "h-37 rounded-lg border border-dashed border-green-500 bg-green-50",
  },
  browse: {
    empty:
      "flex items-center justify-center rounded-md border border-dashed border-grey-200 bg-grey-50 p-md",
    filled: "rounded-xl border border-grey-200 bg-white px-md py-2.5",
    dragging:
      "flex items-center justify-center rounded-md border border-dashed border-evergreen-500 bg-grey-50 p-md",
  },
};

export function UploadDropzone({
  file,
  onFileChange,
  variant = "proof",
  hint = variant === "browse"
    ? "Must be a PDF or image (max. 10 MB)"
    : "PDF, PNG or JPG - Max 10 MB",
  accept = ".pdf,.png,.jpg,.jpeg",
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  variant?: UploadDropzoneVariant;
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
        if (dropped) onFileChange(dropped);
      }}
      className={`relative w-full overflow-hidden ${
        file ? FRAME[variant].filled : FRAME[variant][dragging ? "dragging" : "empty"]
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          onFileChange(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />

      {variant === "browse" ? (
        file ? (
          <div className="flex h-10 items-center gap-md">
            <HugeiconsIcon
              icon={File02Icon}
              className="flex-none text-grey-800"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1 text-body-sm/[normal] font-medium">
              <p className="truncate text-grey-900">{file.name}</p>
              <p className="text-grey-500">{fileSize(file.size)}</p>
            </div>
            <IconButton
              label="Replace file"
              size="xs"
              className="text-evergreen-600"
              onClick={pick}
            >
              <HugeiconsIcon icon={Edit03Icon} />
            </IconButton>
          </div>
        ) : (
          <div className="flex w-85.5 max-w-full flex-col items-center gap-sm text-center">
            <p className="text-body/[normal] font-medium text-grey-900">
              Drag and drop your files here
            </p>
            <p className="text-body-sm/[normal] font-medium text-grey-500">
              or
            </p>
            <Button type="button" size="form" onClick={pick}>
              Browse files
            </Button>
            <p className="text-body-sm/[normal] text-grey-600">{hint}</p>
          </div>
        )
      ) : file ? (
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
              {file.name}
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
