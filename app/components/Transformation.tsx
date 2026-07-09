'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Transformation() {
  // null = no modal, number = index of active video
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  const testimonials = [
    {
      name: 'Bu Dewi',
      role: 'Manager Marketing',
      org: 'RS Permata Gunung Putri',
      thumbnail: '/thumbnails-transformation/Website SDBI (3).png',
      youtubeId: 'uPoc4hfkJYA',
    },
    {
      name: 'Kak Rendi',
      role: 'Tim Troopers BPJS',
      org: 'BPJS Ketenagakerjaan',
      thumbnail: '/thumbnails-transformation/Website SDBI (4).png',
      youtubeId: 'oPQC7VS6tC0',
    },
    {
      name: 'Kak Eka',
      role: 'Tim Digital Marketing',
      org: 'Digital Executive | Sinarmas Land',
      thumbnail: '/thumbnails-transformation/Website SDBI (5).png',
      youtubeId: '7JDA2oJ_CQc',
    },
    {
      name: 'Dokter-dokter',
      role: 'Visual & UI/UX Design',
      org: '| UI/UX Designer | RS Permata',
      thumbnail: '/thumbnails-transformation/Website SDBI (6).png',
      youtubeId: 'jzSsX9zFAJU',
    },
  ];

  return (
    <section className="relative pt-16 md:pt-24 pb-10 md:pb-16 overflow-hidden">
      {/* Background Image - only covers top ~60% */}
      <div className="absolute inset-x-0 top-0 h-[60%] md:h-[65%] z-0">
        <Image
          src="/bg-transformation/Website SDBI (1).png"
          alt="Background pattern"
          fill
          className="object-cover"
          quality={90}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Left text + Right image */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start mb-0">
          {/* Left - Title & Button */}
          <div className="pt-4">
            <h2 className="text-3xl md:text-4xl lg:text-[2.6rem] font-bold leading-tight mb-4">
              <span className="text-[#F5821F] italic">Kisah Transformasi Klien &</span>
              <br />
              <span className="text-[#F5821F] italic">Alumni</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-8 leading-relaxed max-w-md">
              Dampak nyata dari strategi, pelatihan, dan pendampingan SDBI
            </p>
            <button
              onClick={() => setActiveVideo(0)}
              className="inline-flex items-center gap-3 border-2 border-gray-800 text-gray-800 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-800 hover:text-white transition-all duration-300 text-sm group"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:scale-110"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              Tonton Video
            </button>
          </div>

          {/* Right - High-Ticket Closing + Image */}
          <div className="relative min-h-[22rem] md:min-h-[26rem] lg:min-h-[30rem]">
            {/* Text block */}
            <div className="relative z-10 pt-0">
              <h3 className="text-4xl md:text-5xl lg:text-[3.5rem] font-[900] text-[#0A1E3F] leading-[1.05] mb-3 tracking-tight">
                High-Ticket
                <br />
                <span className="bg-[#FFD54F] text-[#0A1E3F] px-4 py-1 inline-block rounded-md mt-2">
                  Closing
                </span>
              </h3>

              <p className="text-gray-700 italic text-base md:text-lg mt-5 leading-relaxed max-w-xs" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                &ldquo;Mengapa Produk Mahal Tidak Butuh &apos;Diskon&apos;, Tapi Butuh &apos;Edukasi&apos;.&rdquo;
              </p>
            </div>
            {/* Coach Yoso Image - positioned so built-in arrow points to quote text */}
            <div className="absolute right-[-1rem] md:right-[-2rem] lg:right-[-1rem] top-[-2rem] md:top-[-1rem] w-[60%] md:w-[65%] lg:w-[62%] h-[calc(100%+2rem)] z-[5]">
              <Image
                src="/image-transformation/image.png"
                alt="Coach Yoso - High Ticket Closing"
                fill
                className="object-contain object-right-top"
                sizes="(max-width: 768px) 60vw, (max-width: 1024px) 38vw, 32vw"
              />
            </div>
          </div>
        </div>

        {/* Testimonial Thumbnail Cards */}
        <div className="relative z-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 -mt-8 md:-mt-14">
          {testimonials.map((person, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onClick={() => setActiveVideo(index)}
            >
              {/* Thumbnail - fixed height for uniform grid alignment */}
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-4 shadow-lg">
                <Image
                  src={person.thumbnail}
                  alt={`Testimoni ${person.name}`}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/50 shadow-lg">
                    <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Info */}
              <h4 className="text-gray-900 font-bold text-sm">{person.name}</h4>
              <p className="text-gray-500 text-xs mt-0.5">{person.role}</p>
              <p className="text-gray-400 text-xs font-medium">{person.org}</p>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-12">
          <button className="w-8 h-2.5 rounded-full bg-[#0A1E3F]" aria-label="Page 1" />
          <button className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors" aria-label="Page 2" />
          <button className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors" aria-label="Page 3" />
          <button className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors" aria-label="Page 4" />
          <button className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors" aria-label="Page 5" />
        </div>
      </div>

      {/* YouTube Shorts Video Modal */}
      {activeVideo !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-[380px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 z-10 text-white/80 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Tutup
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${testimonials[activeVideo].youtubeId}?autoplay=1&rel=0`}
              title={`Video testimoni ${testimonials[activeVideo].name}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Navigation arrows for switching between videos */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveVideo(activeVideo > 0 ? activeVideo - 1 : testimonials.length - 1);
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
            aria-label="Video sebelumnya"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveVideo(activeVideo < testimonials.length - 1 ? activeVideo + 1 : 0);
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
            aria-label="Video selanjutnya"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
