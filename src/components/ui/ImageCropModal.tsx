"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { getCroppedImageFile } from "@/lib/cropImage";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  fileName: string;
  aspect?: number;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

function ImageCropModal({
  isOpen,
  imageSrc,
  fileName,
  aspect = 16 / 9,
  onCancel,
  onConfirm,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsSaving(true);
    try {
      const file = await getCroppedImageFile(imageSrc, croppedAreaPixels, fileName);
      onConfirm(file);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Adjust Your Photo">
      {imageSrc && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-text-secondary">
            Drag to reposition and use the slider to zoom. This crop becomes your storefront hero
            background.
          </p>
          <div className="relative h-72 w-full overflow-hidden rounded-xl bg-black">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-brand"
            />
          </div>
          <Button onClick={handleConfirm} isLoading={isSaving} className="w-full">
            Use This Crop
          </Button>
        </div>
      )}
    </Modal>
  );
}

export { ImageCropModal };
