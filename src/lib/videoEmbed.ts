export type VideoPlatform = "instagram" | "tiktok" | "unknown";

export interface VideoEmbedInfo {
  platform: VideoPlatform;
  embedUrl: string | null;
}

export function getVideoEmbedInfo(url: string): VideoEmbedInfo {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace("www.", "");

    if (host.includes("instagram.com")) {
      const match = parsed.pathname.match(/\/(p|reel|tv)\/([^/]+)/);
      if (match) {
        return { platform: "instagram", embedUrl: `https://www.instagram.com/${match[1]}/${match[2]}/embed` };
      }
      return { platform: "instagram", embedUrl: null };
    }

    if (host.includes("tiktok.com")) {
      const match = parsed.pathname.match(/\/video\/(\d+)/);
      if (match) {
        return { platform: "tiktok", embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}` };
      }
      // vm.tiktok.com short links can't be resolved client-side without a
      // network round trip — fall back to a direct link.
      return { platform: "tiktok", embedUrl: null };
    }

    return { platform: "unknown", embedUrl: null };
  } catch {
    return { platform: "unknown", embedUrl: null };
  }
}
