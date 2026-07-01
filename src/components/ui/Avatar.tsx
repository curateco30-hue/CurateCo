import Image from "next/image";
import { cn, initials } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-11 text-sm",
  lg: "size-16 text-lg",
  xl: "size-24 text-2xl",
};

function Avatar({ src, name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-pale font-display font-medium text-brand",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={name} fill sizes="96px" className="object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}

export { Avatar };
