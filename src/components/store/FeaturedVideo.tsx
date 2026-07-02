import { VideoEmbed } from "@/components/store/VideoEmbed";

interface FeaturedVideoItem {
  videoUrl: string;
  productName: string | null;
}

interface FeaturedVideoProps {
  videos: FeaturedVideoItem[];
  sectionTitle: string;
}

function FeaturedVideo({ videos, sectionTitle }: FeaturedVideoProps) {
  if (videos.length === 0) return null;

  return (
    <div className="px-6 py-10 sm:px-12">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-muted">
        {sectionTitle}
      </p>
      <div className="flex flex-wrap gap-5">
        {videos.map((video, i) => (
          <div key={i}>
            <VideoEmbed url={video.videoUrl} />
            {video.productName && (
              <p className="mt-2 max-w-[280px] text-sm font-medium text-[#1A1A1A]">
                Featuring: {video.productName}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export { FeaturedVideo };
