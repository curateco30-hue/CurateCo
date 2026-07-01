import { ExternalLink } from "lucide-react";
import { getVideoEmbedInfo } from "@/lib/videoEmbed";

interface VideoEmbedProps {
  url: string;
  className?: string;
}

function VideoEmbed({ url, className }: VideoEmbedProps) {
  const { platform, embedUrl } = getVideoEmbedInfo(url);

  if (!embedUrl) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex aspect-[9/16] w-full max-w-[280px] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-beige text-sm text-text-secondary"
      >
        <ExternalLink className="size-5 text-brand" />
        View on {platform === "unknown" ? "original site" : platform}
      </a>
    );
  }

  return (
    <div className={`aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-xl bg-black ${className ?? ""}`}>
      <iframe
        src={embedUrl}
        title="Featured video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="size-full border-0"
        loading="lazy"
      />
    </div>
  );
}

export { VideoEmbed };
