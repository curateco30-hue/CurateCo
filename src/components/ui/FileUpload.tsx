"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  kind?: "image" | "video";
  onFilesChange: (files: File[]) => void;
  className?: string;
}

function FileUpload({
  label,
  hint,
  accept = "image/*",
  multiple = false,
  maxFiles = 1,
  kind = "image",
  onFilesChange,
  className,
}: FileUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const setFilesAndNotify = useCallback(
    (next: File[]) => {
      const limited = next.slice(0, maxFiles);
      setFiles(limited);
      onFilesChange(limited);
    },
    [maxFiles, onFilesChange],
  );

  const handleFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const incomingArr = Array.from(incoming);
      setFilesAndNotify(multiple ? [...files, ...incomingArr] : incomingArr);
    },
    [files, multiple, setFilesAndNotify],
  );

  const removeFile = (index: number) => {
    setFilesAndNotify(files.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#1A1A1A]">
          {label}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center",
          "transition-all duration-300 ease-in-out",
          isDragging ? "border-brand bg-brand-pale" : "border-border bg-beige hover:border-brand/50",
        )}
      >
        <UploadCloud className="size-7 text-brand" />
        <p className="text-sm font-medium text-[#1A1A1A]">
          Drag & drop or <span className="text-brand underline">browse</span>
        </p>
        {hint && <p className="text-xs text-text-muted">{hint}</p>}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-3">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-beige"
            >
              {kind === "image" ? (
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1 p-2 text-center">
                  <Film className="size-6 text-brand" />
                  <span className="line-clamp-2 text-xs text-text-secondary">{file.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                aria-label="Remove file"
                className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { FileUpload };
