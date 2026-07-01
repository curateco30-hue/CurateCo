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
          <div
            key={video.storeSlug}
            className="relative aspect-[9/16] w-40 shrink-0 overflow-hidden rounded-xl bg-black sm:w-48"
          >
            <video
              src={video.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="font-display text-sm font-medium text-white">{video.brandName}</p>
              <a
                href={`/store/${video.storeSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/80 underline"
              >
                Visit Store
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { CuratorVideoShowcase };
export type { VideoStore };
