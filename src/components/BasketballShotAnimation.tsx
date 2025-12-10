'use client';

import { useState, useEffect, useRef } from 'react';

const frames = [
  '/animations/basketball-shot/frame-1-ready.jpeg',
  '/animations/basketball-shot/frame-2-windup.jpeg',
  '/animations/basketball-shot/frame-3-release.jpeg',
  '/animations/basketball-shot/frame-4-flight.jpeg',
  '/animations/basketball-shot/frame-5-swish.jpeg',
  '/animations/basketball-shot/frame-6-celebration.jpeg',
];

interface Props {
  onComplete?: () => void;
  autoPlay?: boolean;
}

// Confetti particle component
function ConfettiParticle({ delay, color, left }: { delay: number; color: string; left: number }) {
  return (
    <div
      className="absolute w-3 h-3 rounded-full animate-confetti-fall"
      style={{
        backgroundColor: color,
        left: `${left}%`,
        animationDelay: `${delay}ms`,
        top: '-10px',
      }}
    />
  );
}

// Organic blob SVG mask for cloud-like cutout effect
function BlobMaskSVG() {
  return (
    <svg className="absolute" width="0" height="0" aria-hidden="true">
      <defs>
        {/* Bumpy cloud-like blob with more irregular edges */}
        <clipPath id="blob-mask" clipPathUnits="objectBoundingBox">
          <path d="M0.08,0.45
            C0.04,0.32 0.08,0.18 0.18,0.12
            C0.25,0.08 0.32,0.04 0.42,0.06
            C0.48,0.02 0.58,0.02 0.65,0.05
            C0.72,0.03 0.82,0.08 0.88,0.15
            C0.95,0.22 0.98,0.32 0.96,0.42
            C0.99,0.52 0.97,0.62 0.92,0.72
            C0.88,0.82 0.78,0.88 0.68,0.92
            C0.58,0.96 0.48,0.98 0.38,0.95
            C0.28,0.92 0.18,0.88 0.12,0.78
            C0.06,0.68 0.04,0.58 0.08,0.45
            Z" />
        </clipPath>
        {/* More irregular cloud shape with pronounced bumps */}
        <clipPath id="cloud-mask" clipPathUnits="objectBoundingBox">
          <path d="M0.12,0.55
            Q0.02,0.45 0.08,0.32
            Q0.12,0.18 0.22,0.12
            Q0.32,0.04 0.45,0.08
            Q0.52,0.02 0.62,0.06
            Q0.75,0.04 0.85,0.15
            Q0.95,0.25 0.92,0.38
            Q0.98,0.48 0.94,0.58
            Q0.96,0.72 0.85,0.82
            Q0.72,0.92 0.58,0.94
            Q0.45,0.98 0.32,0.92
            Q0.18,0.88 0.1,0.75
            Q0.04,0.65 0.12,0.55
            Z" />
        </clipPath>
        {/* Wavy organic shape */}
        <clipPath id="wavy-blob-mask" clipPathUnits="objectBoundingBox">
          <path d="M0.5,0.04
            C0.62,0.02 0.75,0.06 0.84,0.14
            C0.92,0.22 0.96,0.34 0.94,0.46
            C0.98,0.54 0.96,0.66 0.9,0.76
            C0.84,0.86 0.72,0.92 0.6,0.94
            C0.48,0.98 0.36,0.96 0.26,0.9
            C0.16,0.84 0.08,0.74 0.06,0.62
            C0.02,0.5 0.06,0.36 0.14,0.26
            C0.22,0.14 0.36,0.06 0.5,0.04
            Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function BasketballShotAnimation({ onComplete, autoPlay = true }: Props) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showConfetti, setShowConfetti] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const loadedCountRef = useRef(0);

  // Preload all images with timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const imagePromises = frames.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => {
          loadedCountRef.current += 1;
          if (loadedCountRef.current === frames.length) {
            setImagesLoaded(true);
          }
          resolve();
        };
        img.onerror = () => {
          // Still count failed images to prevent infinite loading
          loadedCountRef.current += 1;
          if (loadedCountRef.current === frames.length) {
            setImagesLoaded(true);
          }
          resolve();
        };
      });
    });

    // Set a maximum timeout of 3 seconds for preloading
    timeoutId = setTimeout(() => {
      if (!imagesLoaded) {
        console.log('Image preload timeout - proceeding with animation');
        setImagesLoaded(true);
      }
    }, 3000);

    Promise.all(imagePromises).then(() => {
      clearTimeout(timeoutId);
    });
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [imagesLoaded]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !imagesLoaded) return;

    if (currentFrame < frames.length - 1) {
      const timer = setTimeout(() => {
        const nextFrame = currentFrame + 1;
        setCurrentFrame(nextFrame);
        
        // Trigger confetti on swish frame (frame index 4)
        if (nextFrame === 4) {
          setShowConfetti(true);
        }
      }, 250);
      return () => clearTimeout(timer);
    } else {
      // Animation complete
      setIsPlaying(false);
      onComplete?.();
    }
  }, [currentFrame, isPlaying, imagesLoaded, onComplete]);

  // Generate confetti particles
  const confettiParticles = showConfetti
    ? Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        delay: Math.random() * 500,
        color: i % 2 === 0 ? '#16a34a' : '#f97316', // brand-green and brand-orange
        left: Math.random() * 100,
      }))
    : [];

  // Show loading state while images preload
  if (!imagesLoaded) {
    return (
      <div className="relative w-full max-w-md mx-auto flex items-center justify-center" style={{ aspectRatio: '4/3' }}>
        <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* SVG definitions for blob masks */}
      <BlobMaskSVG />
      
      {/* Confetti container */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {confettiParticles.map((particle) => (
            <ConfettiParticle
              key={particle.id}
              delay={particle.delay}
              color={particle.color}
              left={particle.left}
            />
          ))}
        </div>
      )}

      {/* Decorative cloud/blob background glow */}
      <div
        className="absolute -inset-4 opacity-30 blur-2xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(132, 193, 74, 0.4) 0%, rgba(247, 148, 29, 0.3) 50%, transparent 70%)',
        }}
      />

      {/* Main animation container with organic blob shape */}
      <div
        className="relative z-10"
        style={{
          filter: 'drop-shadow(0 20px 40px rgba(132, 193, 74, 0.25)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))',
        }}
      >
        {/* Blob-shaped container */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '4/3',
            clipPath: 'url(#blob-mask)',
          }}
        >
          {/* Soft inner glow border effect */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 60%, rgba(255, 255, 255, 0.3) 85%, rgba(255, 249, 240, 0.8) 100%)',
            }}
          />
          
          {/* Animation frames */}
          {frames.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Basketball shot animation frame ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ${
                index === currentFrame ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: 'scale(1.05)', // Slight zoom to avoid edge artifacts
              }}
            />
          ))}
        </div>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-brand-green/20 rounded-full blur-sm animate-pulse" />
      <div className="absolute -top-1 -right-3 w-4 h-4 bg-brand-orange/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute -bottom-2 -left-1 w-5 h-5 bg-brand-orange/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute -bottom-3 -right-2 w-7 h-7 bg-brand-green/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.75s' }} />

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-6 relative z-10">
        {frames.map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm ${
              index <= currentFrame
                ? 'bg-gradient-to-br from-brand-green to-emerald-500 scale-100'
                : 'bg-gray-200 scale-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}