import Image from "next/image";

interface ScreenshotFrameProps {
  src: string;
  alt: string;
  url?: string;
}

export function ScreenshotFrame({ src, alt, url = "notimestorage.co" }: ScreenshotFrameProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-gray-800 shadow-2xl shadow-black/50">
      {/* Browser chrome */}
      <div className="flex h-8 shrink-0 items-center gap-1.5 bg-[#1C1C1E] px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" aria-hidden />
        <div className="ml-2 flex h-4 flex-1 max-w-[220px] items-center justify-center rounded bg-[#2C2C2E] px-2">
          <span className="truncate font-mono text-[10px] text-white/30">{url}</span>
        </div>
      </div>
      {/* Screenshot */}
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={90}
        />
      </div>
    </div>
  );
}
