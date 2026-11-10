"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { CloudUploadIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { useToast } from "@repo/ui/toast";
import { useOnboarding } from "../../components/onboarding-provider";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png"];

export function LogoUpload() {
  const { toast } = useToast();
  const { logo, setLogo } = useOnboarding();
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!logo) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(logo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logo]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      toast({ message: "Please choose a JPG or PNG image", state: "error" });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast({ message: "That image is larger than 5MB", state: "error" });
      return;
    }

    setLogo(file);
  }

  return (
    <div className="flex max-w-86.25 items-center gap-md">
      <div className="relative flex size-20 flex-none items-center justify-center overflow-hidden rounded-xl border border-grey-200 bg-white">
        {preview ? (
          <Image
            src={preview}
            alt="Company logo preview"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <Image
            src="/onboarding/logo-placeholder.svg"
            alt=""
            width={29}
            height={29}
            unoptimized
            className="size-[28.667px] -scale-y-100"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="inline"
            leadingIcon={<HugeiconsIcon icon={CloudUploadIcon} />}
            onClick={() => input.current?.click()}
          >
            Upload logo
          </Button>
          <Badge variant="pill">Optional</Badge>
        </div>
        <p className="text-caption/[normal] text-grey-600">
          Max. image size: 5MB (JPG or PNG)
        </p>
      </div>

      <input
        ref={input}
        type="file"
        accept={ACCEPTED.join(",")}
        aria-label="Upload logo"
        tabIndex={-1}
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  );
}
