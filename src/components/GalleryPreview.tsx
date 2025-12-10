"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function GalleryPreview() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80",
      alt: "Basketball action shot",
      label: "Azione",
    },
    {
      src: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&q=80",
      alt: "Team training session",
      label: "Training",
    },
    {
      src: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400&q=80",
      alt: "Basketball on court",
      label: "Campo",
    },
    {
      src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&q=80",
      alt: "Young athletes",
      label: "Team",
    },
    {
      src: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=400&q=80",
      alt: "Basketball game",
      label: "Partita",
    },
  ];

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return;
    if (direction === "prev") {
      setSelectedImage(
        selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1
      );
    } else {
      setSelectedImage(
        selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1
      );
    }
  };

  return (
    <section aria-labelledby="gallery-heading" id="gallery" className="relative">
      {/* Section Header */}
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 bg-brand-green/10 text-brand-green text-xs font-bold rounded-full mb-3">
          📸 I Nostri Momenti
        </span>
        <h2
          className="text-2xl font-extrabold text-brand-dark"
          id="gallery-heading"
        >
          GALLERY
        </h2>
      </div>

      {/* Masonry-style Grid */}
      <div className="grid grid-cols-3 gap-2">
        {galleryImages.map((image, index) => {
          const isLarge = index === 0 || index === 3;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                isLarge ? "row-span-2" : ""
              }`}
              onClick={() => setSelectedImage(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`relative ${isLarge ? "h-full min-h-[200px]" : "h-24"}`}>
                <Image
                  alt={image.alt}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isHovered ? "scale-110 blur-[1px]" : "scale-100"
                  }`}
                  src={image.src}
                  fill
                  sizes={isLarge ? "(max-width: 768px) 33vw, 200px" : "(max-width: 768px) 33vw, 100px"}
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 transition-all duration-300 ${
                  isHovered 
                    ? "bg-gradient-to-t from-brand-dark/80 via-brand-dark/40 to-transparent" 
                    : "bg-gradient-to-t from-black/30 to-transparent"
                }`} />

                {/* Label */}
                <div className={`absolute bottom-2 left-2 transition-all duration-300 ${
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}>
                  <span className="text-xs font-bold text-white bg-brand-orange/80 backdrop-blur-sm px-2 py-1 rounded-full">
                    {image.label}
                  </span>
                </div>

                {/* Zoom Icon */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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

        {/* View All Card */}
        <Link
          href="/galleria"
          className="relative overflow-hidden bg-gradient-to-br from-brand-dark to-gray-800 text-white rounded-2xl flex flex-col items-center justify-center text-center p-3 group h-24"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <pattern id="galleryPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="10" cy="10" r="2" fill="currentColor" />
              </pattern>
              <rect width="100" height="100" fill="url(#galleryPattern)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="w-10 h-10 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-brand-orange group-hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-xs group-hover:text-brand-orange transition-colors">
              VEDI TUTTE
            </span>
          </div>
        </Link>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image Container */}
          <div
            className="relative max-w-4xl w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
            
            {/* Image Info */}
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-brand-orange rounded-full text-sm font-bold text-white">
                  {galleryImages[selectedImage].label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <span className="text-sm">
                  {selectedImage + 1} / {galleryImages.length}
                </span>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(index);
                }}
                className={`w-12 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
                  selectedImage === index 
                    ? "ring-2 ring-brand-orange scale-110" 
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}