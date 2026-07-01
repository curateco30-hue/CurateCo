interface FeaturedVideoProps {
  videoUrl: string;
  productName: string | null;
  sectionTitle: string;
}

function FeaturedVideo({ videoUrl, productName, sectionTitle }: FeaturedVideoProps) {
  return (
    <div className="px-6 py-10 sm:px-12">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-muted">
        {sectionTitle}
      </p>
      <video
        src={videoUrl}
        controls
        autoPlay
        muted
        loop
        playsInline
        className="aspect-video w-full max-w-md rounded-xl bg-black object-cover"
      />
      {productName && (
        <p className="mt-3 text-sm font-medium text-[#1A1A1A]">Featuring: {productName}</p>
      )}
    </div>
  );
}

export { FeaturedVideo };
