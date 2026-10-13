import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function ProductImageGallery({ images = [], name = '' }) {
  const [active, setActive] = useState(0);
  const [imgError, setImgError] = useState({});

  const placeholder = `https://placehold.co/600x600/0C1B30/9BDDF7?text=${encodeURIComponent(name || 'OMASTRA')}`;
  const allImages = images.length > 0 ? images : [placeholder];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px] scrollbar-hide">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'flex-none w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                active === i ? 'border-black' : 'border-gray-200 hover:border-black/50'
              )}
            >
              <img
                src={imgError[i] ? placeholder : img}
                alt={`${name} ${i + 1}`}
                onError={() => setImgError((prev) => ({ ...prev, [i]: true }))}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200">
        <img
          src={imgError[active] ? placeholder : allImages[active]}
          alt={name}
          onError={() => setImgError((prev) => ({ ...prev, [active]: true }))}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}


