"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  year: string;
  featured?: boolean;
}

const galleryImages: GalleryImage[] = [
  // 2024
  { id: 1, src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80", alt: "Partita in corso", category: "Partite", year: "2024", featured: true },
  { id: 2, src: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800&q=80", alt: "Allenamento tecnico", category: "Allenamenti", year: "2024" },
  { id: 3, src: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80", alt: "Pallone sul campo", category: "Allenamenti", year: "2024" },
  { id: 4, src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80", alt: "Giovani atleti", category: "Gruppo", year: "2024", featured: true },
  { id: 5, src: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800&q=80", alt: "Partita serale", category: "Partite", year: "2024" },
  { id: 6, src: "https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=800&q=80", alt: "Attività ricreativa", category: "Attività", year: "2024" },
  { id: 7, src: "https://images.unsplash.com/photo-1559692048-79a3f837883d?w=800&q=80", alt: "Team building", category: "Gruppo", year: "2024" },
  // 2023
  { id: 8, src: "https://images.unsplash.com/photo-1628891890467-b79f2c8ba9dc?w=800&q=80", alt: "Esercizi di tiro", category: "Allenamenti", year: "2023", featured: true },
  { id: 9, src: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80", alt: "Coach in campo", category: "Allenamenti", year: "2023" },
  { id: 10, src: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&q=80", alt: "Partita amichevole", category: "Partite", year: "2023" },
  { id: 11, src: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=800&q=80", alt: "Gioco di squadra", category: "Partite", year: "2023" },
  { id: 12, src: "https://images.unsplash.com/photo-1591491719565-9e7a8e5e7c6d?w=800&q=80", alt: "Merenda insieme", category: "Attività", year: "2023" },
  { id: 13, src: "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=800&q=80", alt: "Foto di gruppo 2023", category: "Gruppo", year: "2023", featured: true },
  { id: 14, src: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80", alt: "Difesa", category: "Allenamenti", year: "2023" },
  // 2022
  { id: 15, src: "https://images.unsplash.com/photo-1560012057-4372e14c5085?w=800&q=80", alt: "Riscaldamento", category: "Allenamenti", year: "2022" },
  { id: 16, src: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80", alt: "Partita finale 2022", category: "Partite", year: "2022", featured: true },
  { id: 17, src: "https://images.unsplash.com/photo-1627627256672-027a4613d028?w=800&q=80", alt: "Premiazione", category: "Attività", year: "2022" },
  { id: 18, src: "https://images.unsplash.com/photo-1591491719550-c3c5ee0c6e04?w=800&q=80", alt: "Momenti insieme", category: "Gruppo", year: "2022" },
  { id: 19, src: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=800&q=80", alt: "Esercizio difensivo", category: "Allenamenti", year: "2022" },
  { id: 20, src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80", alt: "Attività all'aperto", category: "Attività", year: "2022" },
  { id: 21, src: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&q=80", alt: "Foto ricordo", category: "Gruppo", year: "2022" },
];

const years = ["Tutti", "2024", "2023", "2022"];
const categories = ["Tutti", "Allenamenti", "Partite", "Attività", "Gruppo"];

export default function GalleryGrid() {
  const [selectedYear, setSelectedYear] = useState("Tutti");
  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const filteredImages = galleryImages.filter((image) => {
    const yearMatch = selectedYear === "Tutti" || image.year === selectedYear;
    const categoryMatch = selectedCategory === "Tutti" || image.category === selectedCategory;
    return yearMatch && categoryMatch;
  });

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage);
    if (direction === "prev") {
      const newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
      setSelectedImage(filteredImages[newIndex].id);
    } else {
      const newIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
      setSelectedImage(filteredImages[newIndex].id);
    }
  };

  const currentImageIndex = selectedImage !== null
    ? filteredImages.findIndex((img) => img.id === selectedImage)
    : -1;

  const currentImage = selectedImage !== null
    ? filteredImages.find((img) => img.id === selectedImage)
    : null;

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Year Filter */}
          <div className="flex-1">
            <label className="block text-sm font-bold text-brand-dark mb-3">
              📅 Anno
            </label>
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedYear === year
                      ? "bg-gradient-to-r from-brand-orange to-red-500 text-white shadow-lg"
                      : "bg-gray-100 text-brand-gray hover:bg-brand-orange/10 hover:text-brand-orange"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm font-bold text-brand-dark mb-3">
              🏷️ Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-brand-green to-emerald-500 text-white shadow-lg"
                      : "bg-gray-100 text-brand-gray hover:bg-brand-green/10 hover:text-brand-green"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-brand-gray">
            <span className="font-bold text-brand-dark">{filteredImages.length}</span> foto trovate
          </p>
        </div>
      </div>

      {/* Photo Grid - Masonry Style */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {filteredImages.map((image, index) => {
          const isHovered = hoveredImage === image.id;
          const aspectRatio = image.featured ? "aspect-[3/4]" : index % 3 === 0 ? "aspect-square" : "aspect-[4/3]";

          return (
            <div
              key={image.id}
              className="break-inside-avoid"
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <div
                onClick={() => setSelectedImage(image.id)}
                className={`relative ${aspectRatio} overflow-hidden rounded-2xl cursor-pointer group shadow-lg transition-all duration-500 ${
                  isHovered ? "shadow-2xl scale-[1.02]" : ""
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className={`object-cover transition-all duration-500 ${
                    isHovered ? "scale-110" : "scale-100"
                  }`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 transition-all duration-300 ${
                    isHovered
                      ? "bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                      : "bg-gradient-to-t from-black/40 to-transparent"
                  }`}
                />

                {/* Featured Badge */}
                {image.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full shadow-lg">
                      ⭐ In Evidenza
                    </span>
                  </div>
                )}

                {/* Info */}
                <div
                  className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
                    isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <p className="text-white font-semibold text-sm mb-2">{image.alt}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                      {image.category}
                    </span>
                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                      {image.year}
                    </span>
                  </div>
                </div>

                {/* Zoom Icon */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Video Section */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 bg-brand-orange/10 text-brand-orange text-sm font-bold rounded-full mb-4">
            🎬 Video
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark">
            I NOSTRI VIDEO
          </h2>
          <p className="text-brand-gray mt-2">
            Guarda i momenti più emozionanti delle nostre edizioni
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video 1 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg group">
            <div className="relative aspect-video bg-gray-900 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80"
                alt="Video Camp 2024"
                fill
                className="object-cover opacity-70 group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform group-hover:bg-brand-orange-dark">
                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-3 py-1 bg-brand-orange text-white text-sm font-bold rounded-full">
                  Camp 2024
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-brand-dark">Highlights Camp 2024</h3>
              <p className="text-sm text-brand-gray mt-1">
                I migliori momenti dell&apos;edizione 2024 del Mini & Basket Camp
              </p>
            </div>
          </div>

          {/* Video 2 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg group">
            <div className="relative aspect-video bg-gray-900 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800&q=80"
                alt="Video Behind the Scenes"
                fill
                className="object-cover opacity-70 group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform group-hover:bg-brand-green-dark">
                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-3 py-1 bg-brand-green text-white text-sm font-bold rounded-full">
                  Behind the Scenes
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-brand-dark">Dietro le Quinte</h3>
              <p className="text-sm text-brand-gray mt-1">
                Scopri come si svolge una giornata tipo al nostro camp
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && currentImage && (
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
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image Container */}
          <div
            className="relative max-w-5xl w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                className="object-contain bg-black"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>

            {/* Image Info */}
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-brand-orange rounded-full text-sm font-bold text-white">
                  {currentImage.category}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium text-white">
                  {currentImage.year}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <span className="text-sm">
                  {currentImageIndex + 1} / {filteredImages.length}
                </span>
              </div>
            </div>
            <p className="text-white text-center mt-3">{currentImage.alt}</p>
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2">
            {filteredImages.map((img) => (
              <button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(img.id);
                }}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-300 ${
                  selectedImage === img.id
                    ? "ring-2 ring-brand-orange scale-110"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}