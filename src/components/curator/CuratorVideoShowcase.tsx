import { VideoEmbed } from "@/components/store/VideoEmbed";

interface VideoStore {
  storeSlug: string;
  brandName: string;
  videoUrl: string;
}

interface CuratorVideoShowcaseProps {
  title: string;
  videos: VideoStore[];
}

function CuratorVideoShowcase({ title, videos }: CuratorVideoShowcaseProps) {
  if (videos.length === 0) return null;

  return (
    <div>
      <p className="mb-4 text-sm font-medium uppercase tracking-wide text-text-muted">{title}</p>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {videos.map((video) => (
          <div key={video.storeSlug} className="w-40 shrink-0 sm:w-48">
            <VideoEmbed url={video.videoUrl} />
            <p className="mt-2 font-display text-sm font-medium text-[#1A1A1A]">{video.brandName}</p>
            <a
              href={`/store/${video.storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand underline"
            >
              Visit Store
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export { CuratorVideoShowcase };
export type { VideoStore };
