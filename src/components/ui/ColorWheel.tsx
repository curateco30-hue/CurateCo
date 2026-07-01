"use client";

import { useEffect, useRef, useState } from "react";
import { hsvToHex, hsvToRgb, hexToHsv, type Hsv } from "@/lib/color";

interface ColorWheelProps {
  label?: string;
  value: string;
  onChange: (hex: string) => void;
  size?: number;
}

function ColorWheel({ label, value, onChange, size = 200 }: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(value));
  const draggingRef = useRef(false);

  const radius = size / 2;

  // Redraw the wheel whenever brightness (value) or size changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - radius;
        const dy = y - radius;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const idx = (y * size + x) * 4;
        if (dist <= radius) {
          let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          if (angle < 0) angle += 360;
          const s = Math.min(dist / radius, 1);
          const [r, g, b] = hsvToRgb({ h: angle, s, v: hsv.v });
          imageData.data[idx] = r;
          imageData.data[idx + 1] = g;
          imageData.data[idx + 2] = b;
          imageData.data[idx + 3] = 255;
        } else {
          imageData.data[idx + 3] = 0;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [hsv.v, size, radius]);

  useEffect(() => {
    setHsv(hexToHsv(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickFromEvent = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - radius;
    const y = clientY - rect.top - radius;
    const dist = Math.sqrt(x * x + y * y);
    let angle = (Math.atan2(y, x) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    const s = Math.min(dist / radius, 1);
    const next = { h: angle, s, v: hsv.v };
    setHsv(next);
    onChange(hsvToHex(next));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    pickFromEvent(e.clientX, e.clientY);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    pickFromEvent(e.clientX, e.clientY);
  };
  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleBrightness = (v: number) => {
    const next = { ...hsv, v };
    setHsv(next);
    onChange(hsvToHex(next));
  };

  const markerX = radius + hsv.s * radius * Math.cos((hsv.h * Math.PI) / 180);
  const markerY = radius + hsv.s * radius * Math.sin((hsv.h * Math.PI) / 180);

  return (
    <div className="flex flex-col gap-3">
      {label && <label className="text-sm font-medium text-[#1A1A1A]">{label}</label>}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className="cursor-crosshair rounded-full"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
          <div
            className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
            style={{ left: markerX, top: markerY, backgroundColor: value }}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="size-9 shrink-0 rounded-full border border-border shadow-sm" style={{ backgroundColor: value }} />
            <span className="rounded-lg border border-border px-2.5 py-1.5 text-sm uppercase text-[#1A1A1A]">
              {value}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted">Brightness</label>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(hsv.v * 100)}
              onChange={(e) => handleBrightness(Number(e.target.value) / 100)}
              className="accent-brand"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { ColorWheel };
