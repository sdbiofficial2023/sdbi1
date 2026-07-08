import Image from 'next/image';

export default function PartnerBadges() {
  const partners = [
    { name: 'Google Partner', logo: '/badge-layanan/badge-google-partner.png' },
    { name: 'Google Certified', logo: '/badge-layanan/badge-google-certified.png' },
    { name: 'Meta Business Partners', logo: '/badge-layanan/badge-meta.png' },
    { name: 'TikTok Marketing Partners', logo: '/badge-layanan/badge-tiktok.png' },
    { name: 'BNSP', logo: '/badge-layanan/badge-bnsp.png' },
    { name: 'OSS', logo: '/badge-layanan/badge-oss.png' },
  ];

  return (
    <section className="bg-gray-50 pb-16 md:pb-24 -mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-full py-6 md:py-8 px-8 md:px-12 border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-12 md:h-14 relative"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={150}
                  height={56}
                  className="object-contain h-full w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
