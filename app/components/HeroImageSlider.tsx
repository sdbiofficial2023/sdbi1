'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const SLIDES = [
  '/hero-images/hero-slide-1.webp',
  '/hero-images/hero-slide-2.webp',
  '/hero-images/hero-slide-3.webp',
  '/hero-images/hero-slide-4.webp',
];

const INTERVAL_MS = 4000;

export default function HeroImageSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-[4/3]">
      {SLIDES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`SDBI - Digital Marketing Experts ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === active ? 'opacity-100' : 'opacity-0'
          }`}
          priority={index === 0}
        />
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {SLIDES.map((_, index) => (
          <span
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === active ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
