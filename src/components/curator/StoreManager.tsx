"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Settings2, Trash2, PenLine, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { toast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/utils";
import { getVideoEmbedInfo } from "@/lib/videoEmbed";
import { VideoEmbed } from "@/components/store/VideoEmbed";

interface StoreProduct {
  id: string;
  productId: string;
  name: string;
  image: string | null;
  sellingPrice: number;
  commissionPct: number;
  whyCuratedNote: string | null;
}

interface StoreVideo {
  id: string;
  videoUrl: string;
  productId: string | null;
  productName: string | null;
}

interface StoreManagerProps {
  storeId: string;
  storeSlug: string;
  storeProducts: StoreProduct[];
  videos: StoreVideo[];
  maxVideos: number;
}

function StoreManager({
  storeId,
  storeSlug,
  storeProducts: initialProducts,
  videos: initialVideos,
  maxVideos,
}: StoreManagerProps) {
  const supabase = createClient();
  const [products, setProducts] = useState(initialProducts);
  const [videos, setVideos] = useState(initialVideos);
  const [noteTarget, setNoteTarget] = useState<StoreProduct | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [videoProductId, setVideoProductId] = useState("");
  const [isSavingVideo, setIsSavingVideo] = useState(false);

  const remove = async (product: StoreProduct) => {
    if (!confirm(`Remove ${product.name} from your store?`)) return;
    const { error } = await supabase.from("curator_store_products").delete().eq("id", product.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    toast.success("Removed from your store.");
  };

  const openNoteModal = (product: StoreProduct) => {
    setNoteTarget(product);
    setNoteText(product.whyCuratedNote ?? "");
  };

  const saveNote = async () => {
    if (!noteTarget) return;
    if (noteText.trim().length < 50 || noteText.trim().length > 300) {
      toast.error("Notes must be between 50 and 300 characters.");
      return;
    }
    setIsSaving(true);
    const { error } = await supabase
      .from("curator_store_products")
      .update({ why_curated_note: noteText.trim() })
      .eq("id", noteTarget.id);
    setIsSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === noteTarget.id ? { ...p, whyCuratedNote: noteText.trim() } : p)),
    );
    toast.success("Note saved.");
    setNoteTarget(null);
  };

  const addVideo = async () => {
    const trimmed = videoLink.trim();
    if (!trimmed) {
      toast.error("Add an Instagram or TikTok link.");
      return;
    }
    if (getVideoEmbedInfo(trimmed).platform === "unknown") {
      toast.error("Enter a valid Instagram or TikTok link.");
      return;
    }
    if (videos.length >= maxVideos) {
      toast.error(`You can add up to ${maxVideos} videos.`);
      return;
    }
    setIsSavingVideo(true);
    const { data, error } = await supabase
      .from("curator_store_videos")
      .insert({ store_id: storeId, video_url: trimmed, product_id: videoProductId || null })
      .select("id, video_url, product_id")
      .single();
    setIsSavingVideo(false);
    if (error || !data) {
      toast.error(error?.message ?? "Failed to add video.");
      return;
    }
    const linkedProduct = products.find((p) => p.productId === data.product_id);
    setVideos((prev) => [
      ...prev,
      { id: data.id, videoUrl: data.video_url, productId: data.product_id, productName: linkedProduct?.name ?? null },
    ]);
    setVideoLink("");
    setVideoProductId("");
    toast.success("Video added.");
  };

  const removeVideo = async (video: StoreVideo) => {
    if (!confirm("Remove this video from your store?")) return;
    const { error } = await supabase.from("curator_store_videos").delete().eq("id", video.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setVideos((prev) => prev.filter((v) => v.id !== video.id));
    toast.success("Video removed.");
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <a href={`/store/${storeSlug}`} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary">
            <ExternalLink className="size-4" />
            Visit Store
          </Button>
        </a>
        <Link href="/curator/store/edit">
          <Button variant="secondary">
            <Settings2 className="size-4" />
            Edit Store
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card className="p-16 text-center text-sm text-text-muted">
          You haven&apos;t added any products yet.{" "}
          <Link href="/curator/products" className="font-medium text-brand hover:underline">
            Browse products
          </Link>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden">
              <div className="relative aspect-square bg-beige">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-sm font-medium text-[#1A1A1A]">{product.name}</p>
                <p className="mt-1 text-sm text-brand">{formatNaira(product.sellingPrice)}</p>
                <p className="text-xs text-text-muted">Your commission: {product.commissionPct}%</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openNoteModal(product)}>
                    <PenLine className="size-3.5" />
                    Edit Note
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(product)}>
                    <Trash2 className="size-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[#1A1A1A]">Featured Videos</p>
          <span className="text-xs text-text-muted">
            {videos.length}/{maxVideos} used
          </span>
        </div>
        <p className="mb-4 text-xs text-text-secondary">
          Paste Instagram Reel or TikTok links. They play on your storefront, below your products.
        </p>

        {videos.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-4">
            {videos.map((video) => (
              <div key={video.id} className="relative">
                <VideoEmbed url={video.videoUrl} />
                <button
                  onClick={() => removeVideo(video)}
                  aria-label="Remove video"
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
                >
                  <X className="size-3.5" />
                </button>
                {video.productName && (
                  <p className="mt-1.5 max-w-[280px] text-xs text-text-muted">
                    Featuring: {video.productName}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {videos.length < maxVideos ? (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Input
                label="Instagram or TikTok Link"
                placeholder="https://www.instagram.com/reel/..."
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                className="flex-1"
              />
              <Select
                label="Link to Product (optional)"
                value={videoProductId}
                onChange={(e) => setVideoProductId(e.target.value)}
                options={products.map((p) => ({ label: p.name, value: p.productId }))}
                placeholder="Choose a product"
                className="sm:w-56"
              />
            </div>
            <Button onClick={addVideo} isLoading={isSavingVideo} className="mt-4">
              Add Video
            </Button>
          </>
        ) : (
          <p className="text-xs text-text-muted">
            You&apos;ve reached your limit of {maxVideos} videos. Remove one to add another.
          </p>
        )}
      </Card>

      <Modal isOpen={!!noteTarget} onClose={() => setNoteTarget(null)} title="Why I Curated This">
        {noteTarget && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">{noteTarget.name}</p>
            <Textarea
              label="Your Note"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              maxLength={300}
              hint="Between 50 and 300 characters."
            />
            <Button onClick={saveNote} isLoading={isSaving} className="w-full">
              Save Note
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export { StoreManager };
