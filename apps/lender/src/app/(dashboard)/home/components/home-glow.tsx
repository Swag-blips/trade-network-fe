import Image from "next/image";

/** The 2720×1642 file is the 1720×642 shape plus the room its blur needs. */
function Shape({ src, top }: { src: string; top: string }) {
  return (
    <div
      className={`absolute left-[calc(50%-150px)] flex h-[752.487px] w-[1758.107px] -translate-x-1/2 items-center justify-center ${top}`}
    >
      <div className="relative h-160.5 w-430 flex-none rotate-[3.73deg]">
        <div className="absolute inset-[-77.88%_-29.07%]">
          <Image
            src={src}
            alt=""
            width={2720}
            height={1642}
            unoptimized
            className="block size-full max-w-none"
          />
        </div>
      </div>
    </div>
  );
}

export function HomeGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Shape src="/home/glow-back.svg" top="top-[-710px]" />
      <Shape src="/home/glow-front.svg" top="top-[-790px]" />
    </div>
  );
}
