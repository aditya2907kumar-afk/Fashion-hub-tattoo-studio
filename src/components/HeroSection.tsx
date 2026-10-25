import React from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { BotanicalBackdrop } from './BotanicalBackdrop';

interface HeroSectionProps {
  onConsultClick: () => void;
  onExploreServicesClick: () => void;
  onBookClick: () => void;
  websiteBackground?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onConsultClick,
  onExploreServicesClick,
  onBookClick,
  websiteBackground,
}) => {
  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-transparent">
      {/* Dark Botanical Foliage Visual Background */}
      <BotanicalBackdrop customBackground={websiteBackground} />

      {/* The Delicate Artboard Frame with Inset Border & Corner Markers */}
      <div className="absolute inset-3 sm:inset-5 md:inset-8 z-20 pointer-events-none">
        <div className="relative w-full h-full border border-[#D31E1E]/40">
          {/* Top-Left Corner Marker */}
          <div className="absolute -top-[5px] -left-[5px] w-2.5 h-2.5 bg-[#D31E1E]" />
          {/* Top-Right Corner Marker */}
          <div className="absolute -top-[5px] -right-[5px] w-2.5 h-2.5 bg-[#D31E1E]" />
          {/* Bottom-Left Corner Marker */}
          <div className="absolute -bottom-[5px] -left-[5px] w-2.5 h-2.5 bg-[#D31E1E]" />
          {/* Bottom-Right Corner Marker */}
          <div className="absolute -bottom-[5px] -right-[5px] w-2.5 h-2.5 bg-[#D31E1E]" />

          {/* Top Navigation Inside Artboard Frame */}
          <div className="w-full flex items-center justify-between p-4 sm:p-6 md:p-8 pointer-events-auto">
            {/* Top-Left: FASHION HUB */}
            <span className="font-cinzel tracking-[0.25em] uppercase text-xs sm:text-sm text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              FASHION HUB
            </span>

            {/* Top-Right: Instagram & Book Pill Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="https://www.instagram.com/fashion_hub_tattoo_studio_?dlrf=MXI3dTF6dDA2MDJmYg=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#833AB4]/30 via-[#FD1D1D]/30 to-[#FCAF45]/30 hover:from-[#833AB4]/50 hover:via-[#FD1D1D]/50 hover:to-[#FCAF45]/50 border border-pink-400/40 text-white text-[11px] sm:text-xs font-semibold tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                title="Follow Fashion Hub on Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                <span className="hidden sm:inline">@fashion_hub_tattoo_studio_</span>
                <span className="sm:hidden">Instagram</span>
              </a>

              <button
                onClick={onBookClick}
                className="bg-white/15 border border-white/40 rounded-full px-5 py-1.5 text-[11px] sm:text-xs tracking-[0.2em] font-semibold text-white hover:bg-white/30 hover:border-white/70 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                BOOK
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Center Stack Content (100% Strictly Centered) */}
      <div className="relative z-30 max-w-4xl mx-auto px-6 sm:px-8 py-10 flex flex-col items-center justify-center text-center">
        {/* 1. Overhead Meta Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex flex-col items-center justify-center"
        >
          <span className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white font-medium text-center drop-shadow-sm">
            EST. 2018 <span className="text-[#D31E1E] font-bold mx-1.5">▪</span> KANKARBAGH, PATNA, BIHAR
          </span>
        </motion.div>

        {/* 2. Main Title: Massive Serif + Italicized Serif */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center text-center mb-6"
        >
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight text-white font-normal leading-[0.95] text-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            Fashion Hub
          </h1>
          <span className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-white font-normal mt-1 text-center drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
            Tattoo Studio
          </span>
        </motion.div>

        {/* 3. Core Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto mb-6 flex flex-col items-center justify-center"
        >
          <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.22em] uppercase text-white font-semibold leading-relaxed text-center drop-shadow-sm">
            ARTISTRY IN FULL BLOOM — PERMANENT CUSTOM INK <span className="text-[#D31E1E] font-bold mx-1">▪</span> PRECISION BODY PIERCING
          </p>
        </motion.div>

        {/* 4. Lead Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mx-auto mb-8 sm:mb-10 flex flex-col items-center justify-center"
        >
          <p className="text-sm sm:text-base md:text-lg text-white font-normal leading-relaxed text-center text-balance drop-shadow-sm">
            &ldquo;Transforming your stories into timeless skin art and precision body modifications in Patna&apos;s most hygienic, luxury creative environment.&rdquo;
          </p>
        </motion.div>

        {/* 5. Stacked Pill CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Primary CTA */}
          <button
            onClick={onConsultClick}
            className="w-full sm:w-auto bg-[#E52222] hover:bg-[#FF2E2E] text-white font-bold rounded-full px-8 py-3.5 sm:py-4 tracking-[0.2em] text-xs transition-all duration-300 shadow-xl shadow-[#E52222]/40 active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <span>CONSULT A SPECIALIST</span>
            <span aria-hidden="true">&rarr;</span>
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onExploreServicesClick}
            className="w-full sm:w-auto bg-[#162A4A]/90 hover:bg-[#1E3B66] border border-white/40 text-white font-semibold rounded-full px-8 py-3.5 sm:py-4 tracking-[0.2em] text-xs backdrop-blur-md transition-all duration-300 hover:border-white/60 active:scale-95 cursor-pointer text-center flex items-center justify-center shadow-lg"
          >
            EXPLORE SERVICES
          </button>
        </motion.div>
      </div>
    </section>
  );
};
