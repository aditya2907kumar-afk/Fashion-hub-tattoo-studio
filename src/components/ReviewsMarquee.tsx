import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { REVIEWS_DATA } from '../data/reviewsData';

export const ReviewsMarquee: React.FC = () => {
  // 8 top-tier reviews (~4,600px wide per track), perfectly spanning 4K displays with zero compositor jitter
  const trackReviews = REVIEWS_DATA.slice(0, 8);

  return (
    <section className="relative w-full py-28 bg-transparent overflow-hidden">
      {/* Centered Rating Overhead Badge */}
      <div className="max-w-4xl mx-auto px-6 mb-16 text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center justify-center gap-1.5 mb-3 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.7)]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
          ))}
        </div>
        <span className="text-[11px] font-cinzel tracking-[0.25em] uppercase text-[#D31E1E] font-bold text-center flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#D31E1E]" />
          4.9 RATING ▪ 714+ VERIFIED GOOGLE MAPS REVIEWS
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal mt-3 text-center drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
          Genuine Client Feedback
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white/90 mt-2 max-w-md mx-auto text-center">
          Real Google Maps reviews from patrons in Kankarbagh and across Patna.
        </p>
      </div>

      {/* 100% Glitch-Free Seamless Twin-Track Continuous Reviews Marquee (Zero Left Cutoff, Zero Jump) */}
      <div className="w-full overflow-hidden select-none py-4 relative marquee-container">
        <div className="flex w-max">
          {/* Primary Track */}
          <div className="flex shrink-0 items-center gap-16 sm:gap-24 pr-16 sm:pr-24 animate-reviews-marquee">
            {trackReviews.map((rev, idx) => (
              <div
                key={`rev-a-${rev.id}-${idx}`}
                className="flex-shrink-0 w-[300px] sm:w-[420px] md:w-[480px] flex flex-col items-center justify-center text-center px-4"
                style={{ contain: 'layout style paint' }}
              >
                {/* 5-Star Icons */}
                <div className="flex items-center justify-center gap-1 mb-3 text-amber-300">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                  ))}
                </div>

                {/* Weightless Floating Typography (Bright, Luminous & Crisp) */}
                <blockquote className="font-serif italic text-base sm:text-lg md:text-xl text-white font-normal leading-relaxed text-center text-balance mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                  &ldquo;{rev.quote}&rdquo;
                </blockquote>

                {/* Genuine Google Reviewer Attribution */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-semibold tracking-[0.15em] uppercase text-white drop-shadow-sm">
                    — {rev.author}
                  </span>
                  <span className="text-xs tracking-wider text-white/80 mt-1 font-medium flex items-center justify-center gap-1">
                    <span>Google Maps Review</span>
                    {rev.badge && (
                      <>
                        <span className="text-[#D31E1E]">▪</span>
                        <span className="text-white/90">{rev.badge}</span>
                      </>
                    )}
                  </span>
                  <span className="text-xs tracking-widest uppercase text-[#FF5C5C] mt-1 font-semibold">
                    {rev.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Seamless Duplicate Track (Pixel-for-pixel continuous wrap) */}
          <div
            className="flex shrink-0 items-center gap-16 sm:gap-24 pr-16 sm:pr-24 animate-reviews-marquee"
            aria-hidden="true"
          >
            {trackReviews.map((rev, idx) => (
              <div
                key={`rev-b-${rev.id}-${idx}`}
                className="flex-shrink-0 w-[300px] sm:w-[420px] md:w-[480px] flex flex-col items-center justify-center text-center px-4"
                style={{ contain: 'layout style paint' }}
              >
                {/* 5-Star Icons */}
                <div className="flex items-center justify-center gap-1 mb-3 text-amber-300">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                  ))}
                </div>

                {/* Weightless Floating Typography (Bright, Luminous & Crisp) */}
                <blockquote className="font-serif italic text-base sm:text-lg md:text-xl text-white font-normal leading-relaxed text-center text-balance mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                  &ldquo;{rev.quote}&rdquo;
                </blockquote>

                {/* Genuine Google Reviewer Attribution */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-semibold tracking-[0.15em] uppercase text-white drop-shadow-sm">
                    — {rev.author}
                  </span>
                  <span className="text-xs tracking-wider text-white/80 mt-1 font-medium flex items-center justify-center gap-1">
                    <span>Google Maps Review</span>
                    {rev.badge && (
                      <>
                        <span className="text-[#D31E1E]">▪</span>
                        <span className="text-white/90">{rev.badge}</span>
                      </>
                    )}
                  </span>
                  <span className="text-xs tracking-widest uppercase text-[#FF5C5C] mt-1 font-semibold">
                    {rev.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
