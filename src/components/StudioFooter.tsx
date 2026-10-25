import React from 'react';
import { Phone, Heart, Shield, Instagram } from 'lucide-react';

interface StudioFooterProps {
  onBookClick: () => void;
  onExploreServicesClick: () => void;
  onEditPhotosClick?: () => void;
}

export const StudioFooter: React.FC<StudioFooterProps> = ({
  onBookClick,
  onExploreServicesClick,
  onEditPhotosClick,
}) => {
  return (
    <footer className="w-full py-16 px-6 bg-transparent border-t border-white/10 text-center flex flex-col items-center justify-center">
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
        {/* Brand Lockup */}
        <div className="flex flex-col items-center justify-center text-center">
          <span className="font-cinzel tracking-[0.28em] uppercase text-sm text-[#FF3838] font-bold drop-shadow-[0_1px_6px_rgba(255,50,50,0.5)]">
            FASHION HUB
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mt-1 text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            Tattoo & Body Piercing Studio
          </h3>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/95 mt-1 text-center drop-shadow-sm">
            EST. 2018 ▪ KANKARBAGH, PATNA, BIHAR
          </span>
        </div>

        {/* Quick Nav Links (Clean Typography, Strictly Centered) */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white font-semibold">
          <button
            onClick={onExploreServicesClick}
            className="hover:text-[#FF3838] transition-colors tracking-widest uppercase cursor-pointer drop-shadow-sm"
          >
            Services Catalog
          </button>
          <span aria-hidden="true" className="text-white/40">·</span>
          <a
            href="#specialists-section"
            className="hover:text-[#FF3838] transition-colors tracking-widest uppercase drop-shadow-sm"
          >
            Specialists & Artists
          </a>
          <span aria-hidden="true" className="text-white/40">·</span>
          <a
            href="#location-section"
            className="hover:text-[#FF3838] transition-colors tracking-widest uppercase drop-shadow-sm"
          >
            Studio Timings
          </a>
          <span aria-hidden="true" className="text-white/40">·</span>
          <button
            onClick={onBookClick}
            className="hover:text-white transition-colors tracking-widest uppercase cursor-pointer text-[#FF3838] font-bold drop-shadow-sm"
          >
            Book Consultation
          </button>
          {onEditPhotosClick && (
            <>
              <span aria-hidden="true" className="text-white/40">·</span>
              <button
                onClick={onEditPhotosClick}
                className="hover:text-amber-300 text-amber-400/90 transition-colors tracking-widest uppercase cursor-pointer drop-shadow-sm font-semibold"
              >
                Edit Photos
              </button>
            </>
          )}
        </div>

        {/* Direct Contacts */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm text-white pt-2">
          <a
            href="tel:+919334057159"
            className="inline-flex items-center justify-center gap-1.5 hover:text-[#FF4A4A] transition-colors font-extrabold drop-shadow-md text-white"
          >
            <Phone className="w-4 h-4 text-[#FF4A4A]" />
            <span>+91 93340 57159</span>
          </a>
          <span className="text-white/40">|</span>
          <a
            href="tel:+918210874058"
            className="inline-flex items-center justify-center gap-1.5 hover:text-[#FF4A4A] transition-colors font-extrabold drop-shadow-md text-white"
          >
            <Phone className="w-4 h-4 text-[#FF4A4A]" />
            <span>+91 82108 74058</span>
          </a>
          <span className="hidden sm:inline text-white/30">|</span>
          <a
            href="https://www.instagram.com/fashion_hub_tattoo_studio_?dlrf=MXI3dTF6dDA2MDJmYg=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#833AB4]/30 via-[#FD1D1D]/30 to-[#FCAF45]/30 hover:from-[#833AB4]/50 hover:via-[#FD1D1D]/50 hover:to-[#FCAF45]/50 border border-pink-500/40 text-white font-bold hover:scale-105 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-[#E1306C]" />
            <span>@fashion_hub_tattoo_studio_</span>
          </a>
        </div>

        {/* Hygiene Guarantee */}
        <div className="inline-flex items-center justify-center gap-2 text-xs text-white font-semibold bg-black/60 border border-white/40 px-5 py-2 rounded-full shadow-lg">
          <Shield className="w-4 h-4 text-[#FF4A4A]" />
          <span>100% Autoclave Sterilized ▪ Single-Use Needles Opened In Plain Sight</span>
        </div>

        {/* Copyright */}
        <div className="pt-4 text-center flex flex-col items-center justify-center border-t border-white/10 w-full">
          <p className="text-xs text-white font-medium text-center drop-shadow-sm">
            &copy; {new Date().getFullYear()} Fashion Hub Tattoo Studio. All rights reserved.
          </p>
          <p className="text-xs text-white/90 font-normal mt-1 text-center flex items-center justify-center gap-1">
            Handcrafted for Kankarbagh, Patna with <Heart className="w-3 h-3 fill-[#FF4A4A] text-[#FF4A4A]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
