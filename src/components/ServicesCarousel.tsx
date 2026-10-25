import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ServiceItem } from '../types';
import { SERVICES_DATA } from '../data/servicesData';
import {
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ServicesCarouselProps {
  onSelectService: (service: ServiceItem) => void;
  customImages?: Record<string, string>;
}

export const ServicesCarousel: React.FC<ServicesCarouselProps> = ({
  onSelectService,
  customImages = {},
}) => {
  // 2 sets of 15 services (30 items total for seamless wrap)
  const carouselItems = [...SERVICES_DATA, ...SERVICES_DATA];

  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mutable animation state (no React re-renders during motion)
  const xRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const isInteractingRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const dragDistanceRef = useRef<number>(0);
  const singleSetWidthRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);
  const currentSpeedRef = useRef<number>(80);

  const [isGrabbing, setIsGrabbing] = useState(false);

  // Measure single loop set width accurately
  const updateMetrics = useCallback(() => {
    if (!trackRef.current) return;
    const totalWidth = trackRef.current.scrollWidth;
    const singleSet = totalWidth / 2;
    singleSetWidthRef.current = singleSet;
  }, []);

  // Pause ticker when section is offscreen to preserve 100% GPU/CPU for page scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, [updateMetrics]);

  // Buttery-smooth ticker loop: delta-time aware, 60/120fps consistent, gentle ease-in/ease-out on hover
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    const cruisingSpeed = 82; // pixels per second (frame-rate independent)

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.08); // seconds elapsed, clamped against lag spikes
      lastTime = now;

      if (isVisibleRef.current) {
        if (!isInteractingRef.current) {
          // Silky smooth inertia decay
          if (Math.abs(velocityRef.current) > 0.05) {
            velocityRef.current *= Math.pow(0.04, dt);
            xRef.current -= velocityRef.current;
          } else {
            velocityRef.current = 0;
            // Smooth ease-in / ease-out for hover pause (soft luxury deceleration)
            const targetSpeed = isHoveredRef.current ? 0 : cruisingSpeed;
            currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * Math.min(1, dt * 7);
            xRef.current -= currentSpeedRef.current * dt;
          }
        }

        const singleSet = singleSetWidthRef.current;
        if (singleSet > 0) {
          // Seamless modulo wrap
          while (xRef.current <= -singleSet) {
            xRef.current += singleSet;
          }
          while (xRef.current > 0) {
            xRef.current -= singleSet;
          }

          if (trackRef.current) {
            trackRef.current.style.transform = `translate3d(${xRef.current.toFixed(2)}px, 0, 0)`;
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pointer event handlers for swipe/drag
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    isInteractingRef.current = true;
    setIsGrabbing(true);
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    dragDistanceRef.current = 0;

    if (trackRef.current) {
      trackRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const currentX = e.clientX;
    const currentTime = performance.now();
    const deltaX = currentX - lastXRef.current;
    const deltaTime = Math.max(1, currentTime - lastTimeRef.current);

    dragDistanceRef.current += Math.abs(deltaX);
    xRef.current += deltaX;

    // Instant velocity for flick gesture
    velocityRef.current = (deltaX / deltaTime) * -16;

    lastXRef.current = currentX;
    lastTimeRef.current = currentTime;

    const singleSet = singleSetWidthRef.current;
    if (singleSet > 0) {
      if (xRef.current <= -singleSet) {
        xRef.current += singleSet;
      } else if (xRef.current > 0) {
        xRef.current -= singleSet;
      }
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsGrabbing(false);

    if (trackRef.current && trackRef.current.hasPointerCapture(e.pointerId)) {
      trackRef.current.releasePointerCapture(e.pointerId);
    }

    // Clamp flick velocity
    velocityRef.current = Math.max(-28, Math.min(28, velocityRef.current));

    setTimeout(() => {
      isInteractingRef.current = false;
    }, 150);
  };

  const handleCardClick = (service: ServiceItem) => {
    if (dragDistanceRef.current < 6) {
      onSelectService(service);
    }
  };

  return (
    <section id="services-section" className="relative w-full py-24 bg-transparent overflow-hidden">
      {/* Section Header (100% Strictly Centered) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 mb-12 text-center flex flex-col items-center justify-center">
        <span className="text-[10px] sm:text-xs font-cinzel tracking-[0.25em] uppercase text-[#D31E1E] mb-2.5 text-center flex items-center justify-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#D31E1E]" />
          MASTER CRAFT & PRECISION PIERCINGS
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal leading-tight text-center drop-shadow-[0_2px_18px_rgba(0,0,0,0.8)]">
          Artisanal Service Catalog
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl mx-auto mt-3 text-center text-balance leading-relaxed">
          From full bespoke realism sleeves to sterile ear and dermal modifications. Touch and swipe with your fingers in any direction.
        </p>

        {/* Dynamic Finger Control Hint */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] text-white/80 tracking-widest uppercase">
          <span className="bg-black/40 border border-white/15 px-4 py-1.5 rounded-full">
            &larr; Swipe or drag in any direction &rarr;
          </span>
        </div>
      </div>

      {/* Infinite Hardware-Accelerated Track Container (Controlled With Fingers) */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden select-none py-4"
        style={{ touchAction: 'pan-y' }}
      >
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          className={`flex gap-5 sm:gap-6 px-6 ${
            isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            width: 'max-content',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {carouselItems.map((service, index) => {
            const currentImg = customImages[service.id] || service.imageUrl;

            return (
              <div
                key={`${service.id}-${index}`}
                onClick={() => handleCardClick(service)}
                className="group relative flex-shrink-0 w-72 sm:w-80 h-96 sm:h-[420px] rounded-2xl overflow-hidden bg-black/50 border border-white/15 hover:border-[#D31E1E]/80 shadow-2xl transition-all duration-300 flex flex-col items-center justify-between text-center p-6 cursor-pointer"
                style={{ contain: 'layout style paint' }}
              >
                {/* Optimized Image Layer */}
                <img
                  src={currentImg}
                  alt={service.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />

                {/* Gentle Gradient Overlays for Title Readability without Dulling Photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30 pointer-events-none" />

                {/* Top Bar with Subtitle Tag */}
                <div className="relative z-20 w-full flex items-center justify-center">
                  <span className="text-[10px] font-cinzel tracking-[0.2em] uppercase text-white font-semibold bg-black/60 border border-white/20 px-3 py-1 rounded-full truncate max-w-[240px]">
                    {service.subtitle}
                  </span>
                </div>

                {/* Centered Service Name */}
                <div className="relative z-10 w-full flex flex-col items-center justify-center text-center my-auto px-2 pointer-events-none">
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-normal leading-snug text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                    {service.name}
                  </h3>
                </div>

                {/* Bottom View Protocol Pill */}
                <div className="relative z-10 w-full flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="inline-flex items-center justify-center gap-1.5 text-xs tracking-widest uppercase font-semibold text-white/90 group-hover:text-white transition-all py-2 px-4 rounded-full bg-black/50 border border-white/20 group-hover:border-[#D31E1E] group-hover:bg-[#D31E1E]">
                    <span>VIEW PROTOCOL</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
