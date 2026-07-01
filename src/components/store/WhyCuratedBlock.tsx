import { Avatar } from "@/components/ui/Avatar";

interface WhyCuratedBlockProps {
  note: string;
  curatorName: string;
  curatorPhotoUrl: string | null;
  sectionTitle: string;
  backgroundColor: string;
  isItalic: boolean;
}

function WhyCuratedBlock({
  note,
  curatorName,
  curatorPhotoUrl,
  sectionTitle,
  backgroundColor,
  isItalic,
}: WhyCuratedBlockProps) {
  return (
    <div className="rounded-2xl border-l-4 border-brand p-6" style={{ backgroundColor }}>
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A]">
        {sectionTitle}
      </p>
      <div className="flex items-start gap-4">
        <Avatar name={curatorName} src={curatorPhotoUrl} size="md" />
        <div>
          <p className={`text-base text-[#1A1A1A] ${isItalic ? "font-display italic" : ""}`}>
            &ldquo;{note}&rdquo;
          </p>
          <p className="mt-2 text-sm font-medium text-brand">— {curatorName}</p>
        </div>
      </div>
    </div>
  );
}

export { WhyCuratedBlock };
