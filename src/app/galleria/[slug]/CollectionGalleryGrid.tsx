"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { GalleryPhoto } from "@/types/gallery";

interface CollectionGalleryGridProps {
  photos: GalleryPhoto[];
  collectionName: string;
}

export default function CollectionGalleryGrid({ photos, collectionName }: CollectionGalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedIndex === null) return;
    
    if (e.key === "Escape") {
      setSelectedIndex(null);
    } else if (e.key === "ArrowLeft") {
      setSelectedIndex(prev => prev === 0 ? photos.length - 1 : (prev ?? 0) - 1);
    } else if (e.key === "ArrowRight") {
      setSelectedIndex(prev => prev === photos.length - 1 ? 0 : (prev ?? 0) + 1);
    }
  }, [selectedIndex, photos.length]);

  useEffect(() => {
    if (selectedIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex, handleKeyDown]);

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedIndex === null) return;
    if (direction === "prev") {
      setSelectedIndex(selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1);
    } else {
      setSelectedIndex(selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const currentPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <div>
      {/* Results Count */}
      <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-brand-gray">
            <span className="font-bold text-brand-dark">{photos.length}</span> foto in questa collezione
          </p>
          <p className="text-xs text-brand-gray">
            Clicca su una foto per ingrandirla
          </p>
        </div>
      </div>

      {/* Photo Grid - Masonry Style */}
      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
        {photos.map((photo, index) => {
          const isHovered = hoveredIndex === index;
          // Vary aspect ratios for visual interest
          const aspectRatio = photo.featured 
            ? "aspect-[3/4]" 
            : index % 5 === 0 
              ? "aspect-square" 
              : index % 3 === 0 
                ? "aspect-[4/5]" 
                : "aspect-[4/3]";

          return (
            <div
              key={photo.id}
              className="break-inside-avoid"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                onClick={() => setSelectedIndex(index)}
                className={`relative ${aspectRatio} overflow-hidden rounded-xl cursor-pointer group shadow-md transition-all duration-300 ${
                  isHovered ? "shadow-xl scale-[1.02]" : ""
                }`}
              >
                {/* Loading placeholder */}
                {isLoading[photo.id] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
                
                <Image
                  src={photo.url}
                  alt={photo.alt_text || `${collectionName} - Foto ${index + 1}`}
                  fill
                  className={`object-cover transition-all duration-500 ${
                    isHovered ? "scale-110" : "scale-100"
                  }`}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  onLoadingComplete={() => setIsLoading(prev => ({ ...prev, [photo.id]: false }))}
                  onLoad={() => setIsLoading(prev => ({ ...prev, [photo.id]: false }))}
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 transition-all duration-300 ${
                    isHovered
                      ? "bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                      : "bg-gradient-to-t from-black/30 to-transparent"
                  }`}
                />

                {/* Featured Badge */}
                {photo.featured && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-brand-orange text-white text-xs font-bold rounded-full shadow-lg">
                      ⭐ In Evidenza
                    </span>
                  </div>
                )}

                {/* Photo Number */}
                <div className={`absolute bottom-2 right-2 transition-all duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}>
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                    {index + 1} / {photos.length}
                  </span>
                </div>

                {/* Zoom Icon */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && currentPhoto && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
            aria-label="Foto precedente"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image Container */}
          <div
            className="relative max-w-6xl w-full max-h-[90vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.alt_text || `${collectionName} - Foto ${selectedIndex + 1}`}
                fill
                className="object-contain bg-black"
                sizes="100vw"
                priority
              />
            </div>

            {/* Image Info */}
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-brand-orange rounded-full text-sm font-bold text-white">
                  {collectionName}
                </span>
                {currentPhoto.featured && (
                  <span className="px-3 py-1 bg-yellow-500 rounded-full text-sm font-bold text-white">
                    ⭐ In Evidenza
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <span className="text-sm">
                  {selectedIndex + 1} / {photos.length}
                </span>
              </div>
            </div>
            
            {currentPhoto.alt_text && (
              <p className="text-white text-center mt-3">{currentPhoto.alt_text}</p>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
            aria-label="Foto successiva"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90"
            aria-label="Chiudi"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Keyboard Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/40 text-xs">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
              <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
              Naviga
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd>
              Chiudi
            </span>
          </div>

          {/* Thumbnail Strip - Show for smaller collections */}
          {photos.length <= 20 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2 px-4">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(index);
                  }}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
                    selectedIndex === index
                      ? "ring-2 ring-brand-orange scale-110"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={photo.url}
                    alt={`Thumbnail ${index + 1}`}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}