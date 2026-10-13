import { useState, useRef, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ProductImageGallery({
  images = [],
  productName = '',
  name = '',
  defaultImage = '',
}) {
  const displayName = productName || name || 'OMASTRA Product';

  // Normalize images into array of { url, alt, label }
  const rawList = Array.isArray(images) && images.length > 0
    ? images
    : defaultImage
      ? [defaultImage]
      : ['/products/whey-pro.png'];

  const normalizedImages = rawList.map((item, idx) => {
    if (typeof item === 'string') {
      return {
        url: item,
        alt: `${displayName} - View ${idx + 1}`,
        label: idx === 0 ? 'Front' : `View ${idx + 1}`,
      };
    }
    if (item && typeof item === 'object') {
      return {
        url: item.url || item.image || item.src || '',
        alt: item.alt || `${displayName} - ${item.label || `View ${idx + 1}`}`,
        label: item.label || (idx === 0 ? 'Front' : `View ${idx + 1}`),
      };
    }
    return {
      url: '/products/whey-pro.png',
      alt: displayName,
      label: 'Front',
    };
  }).filter((img) => Boolean(img.url));

  const safeImages = normalizedImages.length > 0
    ? normalizedImages
    : [{ url: '/products/whey-pro.png', alt: displayName, label: 'Front' }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [failedImages, setFailedImages] = useState({});

  const imageContainerRef = useRef(null);

  // Keep activeIndex within bounds if safeImages change
  useEffect(() => {
    if (activeIndex >= safeImages.length) {
      setActiveIndex(0);
    }
  }, [safeImages.length, activeIndex]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % safeImages.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, safeImages.length]);

  const currentImage = safeImages[activeIndex] || safeImages[0];

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const handleImageLoad = (idx) => {
    setLoadedImages((prev) => ({ ...prev, [idx]: true }));
  };

  const handleImageError = (idx) => {
    setFailedImages((prev) => ({ ...prev, [idx]: true }));
  };

  return (
    <div className="w-full select-none">
      {/* Desktop & Tablet Gallery Layout */}
      <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-6 items-start">
        
        {/* Amazon-Style Vertical Thumbnails (Desktop) / Horizontal Strip (Mobile) */}
        {safeImages.length > 1 && (
          <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto w-full md:w-20 lg:w-24 shrink-0 py-1 md:py-0 md:max-h-[580px] scrollbar-thin">
            {safeImages.map((img, idx) => {
              const isSelected = activeIndex === idx;
              const isFailed = failedImages[idx];
              const displaySrc = isFailed ? '/products/whey-pro.png' : img.url;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  aria-label={`Select ${img.label || `Image ${idx + 1}`}`}
                  className={cn(
                    'group relative flex-none w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl p-1.5 bg-white transition-all duration-200 text-left focus:outline-none',
                    isSelected
                      ? 'border-2 border-black shadow-md ring-1 ring-black/10 scale-[1.02]'
                      : 'border border-gray-200 hover:border-gray-400 hover:shadow-sm opacity-80 hover:opacity-100'
                  )}
                >
                  <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg bg-gray-50/50">
                    <img
                      src={displaySrc}
                      alt={img.alt || `${displayName} thumbnail ${idx + 1}`}
                      onError={() => handleImageError(idx)}
                      className={cn(
                        'w-full h-full object-contain transition-transform duration-200 group-hover:scale-105',
                        displaySrc.endsWith('.svg') || displaySrc.includes('infographic') || displaySrc.includes('back')
                          ? 'object-contain p-0.5'
                          : 'object-contain'
                      )}
                      loading="lazy"
                    />
                  </div>

                  {/* Micro label badge */}
                  {img.label && (
                    <span
                      className={cn(
                        'absolute -bottom-1.5 left-1/2 -translate-x-x-1/2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow-xs transition-colors',
                        isSelected
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-black'
                      )}
                      style={{ transform: 'translateX(-50%)' }}
                    >
                      {img.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Product Image Container */}
        <div className="relative flex-1 w-full bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          
          {/* Main Display Area with Interactive Zoom */}
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsLightboxOpen(true)}
            className="relative w-full aspect-square md:aspect-[4/4] lg:aspect-square flex items-center justify-center p-6 sm:p-8 cursor-crosshair overflow-hidden group bg-linear-to-b from-gray-50/40 via-white to-gray-50/20"
          >
            {/* View category badge */}
            {currentImage.label && (
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 backdrop-blur-xs text-black text-xs font-semibold tracking-wide border border-black/10">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                {currentImage.label}
              </div>
            )}

            {/* Click to expand button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              title="Click to view full size"
              aria-label="Open full screen lightbox"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black shadow-xs hover:shadow-md border border-gray-200/80 flex items-center justify-center transition-all duration-150 backdrop-blur-xs"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Hint overlay on initial hover */}
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/75 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <ZoomIn className="w-3.5 h-3.5" />
              Hover to zoom · Click to expand
            </div>

            {/* Main Image with Zoom Pan Effect */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={failedImages[activeIndex] ? '/products/whey-pro.png' : currentImage.url}
                alt={currentImage.alt || displayName}
                onLoad={() => handleImageLoad(activeIndex)}
                onError={() => handleImageError(activeIndex)}
                className={cn(
                  'w-full h-full max-h-[520px] object-contain transition-transform duration-100 ease-out will-change-transform drop-shadow-sm',
                  isZoomed ? 'scale-175' : 'scale-100'
                )}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : undefined
                }
              />
            </div>
          </div>

          {/* Quick thumbnail navigation arrows on mobile & tablet */}
          {safeImages.length > 1 && (
            <div className="md:hidden flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500 font-medium">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
                }
                className="flex items-center gap-1 hover:text-black"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span>
                {activeIndex + 1} of {safeImages.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((prev) => (prev + 1) % safeImages.length)
                }
                className="flex items-center gap-1 hover:text-black"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div
            className="w-full max-w-6xl flex items-center justify-between text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="text-sm font-semibold tracking-wider uppercase text-gray-300">
                OMASTRA Gallery
              </p>
              <h3 className="text-lg font-bold text-white tracking-wide truncate max-w-md sm:max-w-xl">
                {displayName} — {currentImage.label}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close fullscreen view"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Center Image with Navigation Arrows */}
          <div
            className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Arrow */}
            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length)
                }
                aria-label="Previous image"
                className="absolute left-2 sm:left-4 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20 shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* High-res Image preview */}
            <div className="max-w-full max-h-[70vh] flex items-center justify-center p-4">
              <img
                src={failedImages[activeIndex] ? '/products/whey-pro.png' : currentImage.url}
                alt={currentImage.alt || displayName}
                className="max-w-full max-h-[70vh] object-contain drop-shadow-2xl rounded-lg"
              />
            </div>

            {/* Next Arrow */}
            {safeImages.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((prev) => (prev + 1) % safeImages.length)
                }
                aria-label="Next image"
                className="absolute right-2 sm:right-4 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20 shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnails */}
          {safeImages.length > 1 && (
            <div
              className="w-full max-w-3xl flex items-center justify-center gap-2 overflow-x-auto py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {safeImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    'w-14 h-14 sm:w-16 sm:h-16 rounded-lg p-1 bg-white/10 transition-all overflow-hidden flex items-center justify-center shrink-0',
                    activeIndex === idx
                      ? 'border-2 border-white ring-2 ring-white/50 scale-105'
                      : 'border border-white/20 opacity-60 hover:opacity-100'
                  )}
                >
                  <img
                    src={failedImages[idx] ? '/products/whey-pro.png' : img.url}
                    alt={img.label || `Thumb ${idx + 1}`}
                    className="w-full h-full object-contain"
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
