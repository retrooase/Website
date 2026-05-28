"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, Upload } from "lucide-react";

const PHOTO_HINTS = [
  { label: "Vorderseite", emoji: "↑" },
  { label: "Rückseite", emoji: "↓" },
  { label: "Seriennummer", emoji: "#" },
  { label: "Schäden", emoji: "!" },
  { label: "Zubehör", emoji: "+" },
] as const;

const MAX_PHOTOS = 10;

export function WizardStep4Photos({
  photos,
  onChange,
}: {
  photos: File[];
  onChange: (files: File[]) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urls = photos.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [photos]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const remaining = MAX_PHOTOS - photos.length;
    const valid = Array.from(list)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, remaining);
    if (valid.length > 0) onChange([...photos, ...valid]);
  }

  function removePhoto(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-sans font-bold text-text-primary text-lg mb-1">
          Fotos hinzufügen
        </h3>
        <p className="font-sans text-sm text-text-secondary">
          Gute Fotos = präziseres Angebot. Bis zu {MAX_PHOTOS} Bilder.
        </p>
      </div>

      {/* Drag & Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-150 ${
          dragOver
            ? "border-accent-orange bg-[rgba(255,107,53,0.05)]"
            : photos.length >= MAX_PHOTOS
            ? "border-border opacity-50 cursor-not-allowed"
            : "border-border hover:border-accent-orange/60 hover:bg-surface"
        }`}
        aria-label="Fotos hinzufügen"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
          disabled={photos.length >= MAX_PHOTOS}
        />
        <Camera
          size={32}
          className={`mx-auto mb-3 ${dragOver ? "text-accent-orange" : "text-text-secondary"}`}
        />
        <p className="font-sans font-semibold text-sm text-text-primary">
          {dragOver ? "Loslassen zum Hinzufügen" : "Fotos hierher ziehen"}
        </p>
        <p className="font-sans text-xs text-text-secondary mt-1">
          oder{" "}
          <span className="text-accent-orange font-semibold">Klicken zum Auswählen</span>
        </p>
        <p className="font-sans text-xs text-text-secondary mt-2">
          JPG, PNG, WEBP · max. {MAX_PHOTOS} Fotos
        </p>
      </div>

      {/* Hints */}
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
          Empfohlene Aufnahmen
        </p>
        <div className="grid grid-cols-5 gap-2">
          {PHOTO_HINTS.map((hint) => (
            <div
              key={hint.label}
              className="border border-border bg-surface p-2 text-center"
            >
              <span className="font-mono text-[11px] text-accent-orange font-bold block">
                {hint.emoji}
              </span>
              <p className="font-sans text-[10px] text-text-secondary mt-0.5">
                {hint.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Preview grid */}
      {photos.length > 0 && (
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
            {photos.length} {photos.length === 1 ? "Foto" : "Fotos"} ausgewählt
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {previews.map((url, i) => (
              <div key={url} className="relative aspect-square group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-full object-cover border border-border"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(i);
                  }}
                  aria-label={`Foto ${i + 1} entfernen`}
                  className="absolute top-1 right-1 bg-background/90 border border-border p-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:border-red-400 hover:text-red-500"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-border hover:border-accent-orange/60 flex items-center justify-center transition-colors"
                aria-label="Weiteres Foto hinzufügen"
              >
                <Upload size={18} className="text-text-secondary" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
