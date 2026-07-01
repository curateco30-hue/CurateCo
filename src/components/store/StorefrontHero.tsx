import Image from "next/image";

interface StorefrontHeroProps {
  photoUrl: string | null;
  brandColor: string;
  headline: string;
  settings: {
    overlayOpacity?: number;
    minHeightDesktop?: string;
    minHeightMobile?: string;
    headingFontSize?: string;
  };
}

function StorefrontHero({ photoUrl, brandColor, headline, settings }: StorefrontHeroProps) {
  const opacity = settings.overlayOpacity ?? 0.5;

  return (
    <>
      <style>{`
        .storefront-hero { min-height: ${settings.minHeightMobile ?? "50vh"}; }
        @media (min-width: 640px) {
          .storefront-hero { min-height: ${settings.minHeightDesktop ?? "70vh"}; }
        }
      `}</style>
      <div className="storefront-hero relative flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {photoUrl ? (
            <Image src={photoUrl} alt="" fill priority className="object-cover object-[center_top]" />
          ) : (
            <div className="absolute inset-0" style={{ backgroundColor: brandColor }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: brandColor, opacity: opacity * 0.4 }}
          />
        </div>
        <div className="relative w-full p-6 pb-10 sm:p-12 sm:pb-16">
          <p
            className="font-display italic text-white drop-shadow-sm"
            style={{ fontSize: settings.headingFontSize ?? "48px" }}
          >
            {headline}
          </p>
        </div>
      </div>
    </>
  );
}

export { StorefrontHero };
