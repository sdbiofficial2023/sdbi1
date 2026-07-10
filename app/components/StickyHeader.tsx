'use client';

import { useEffect, useRef, useState } from 'react';
import MarqueeBar from './MarqueeBar';
import Navbar from './Navbar';

export default function StickyHeader() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      // desktop keeps the header always visible; only mobile hides on scroll
      if (menuOpen || window.innerWidth >= 768) {
        setHidden(false);
        lastY.current = window.scrollY;
        return;
      }

      const currentY = window.scrollY;
      const delta = currentY - lastY.current;

      if (currentY < 80) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
      } else if (delta < -4) {
        setHidden(false);
      }
      lastY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  return (
    <div
      className={`sticky top-0 z-50 flex flex-col transition-transform duration-300 ease-out ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <MarqueeBar />
      <Navbar onOpenChange={setMenuOpen} />
    </div>
  );
}
