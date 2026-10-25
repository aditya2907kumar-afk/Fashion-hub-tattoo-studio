import React, { useState, useRef } from 'react';
import { motion, PanInfo } from 'motion/react';
import { SPECIALISTS_DATA } from '../data/specialistsData';
import { Specialist } from '../types';
import { Award, MessageCircle, Sparkles, CheckCircle2, Hand, Upload, Loader2 } from 'lucide-react';
import { optimizeImageFile } from '../utils/permanentDb';

interface SpecialistsShowcaseProps {
  onConsultSpecialist: (specialist: Specialist) => void;
  specialistsBackground?: string;
  isLocked?: boolean;
  onUploadBackground?: (bgUrl: string) => void;
}

export const SpecialistsShowcase: React.FC<SpecialistsShowcaseProps> = ({
  onConsultSpecialist,
  specialistsBackground,
  isLocked = false,
  onUploadBackground,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pure Hand Gesture Handler: Swiping Left or Right
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 35;
    const velocityThreshold = 140;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      setCurrentIndex(1);
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      setCurrentIndex(0);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadBackground) return;

    setIsUploading(true);
    try {
      const optimized = await optimizeImageFile(file, 1800, 0.9);
      onUploadBackground(optimized);
    } catch (err) {
      console.error('Error optimizing specialists box background:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section
      id="specialists-section"
      className="relative w-full max-w-full min-h-screen py-24 px-4 sm:px-6 md:px-8 bg-transparent overflow-hidden flex flex-col items-center justify-center text-center select-none"
    >

      {/* Hidden file input for box background */}
      {!isLocked && onUploadBackground && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="specialist-box-bg-input"
        />
      )}

      {/* Section Overhead Label */}
      <div className="relative z-10 max-w-4xl mx-auto mb-8 text-center flex flex-col items-center justify-center">
        <span className="text-[10px] sm:text-xs font-cinzel tracking-[0.25em] uppercase text-[#D31E1E] font-bold mb-2 text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D31E1E]" />
          EST. 2018 ▪ ELITE ARTIST COLLECTIVE & MANAGEMENT
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal text-center drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
          Meet Our Specialists
        </h2>
        <p className="text-sm sm:text-base text-white/90 mt-2 max-w-xl text-center">
          At Fashion Hub, you are never confined to one style. As our Studio Manager and veteran specialist, <span className="text-[#D31E1E] font-semibold">Shrey Raj</span> evaluates your concept and pairs you with the absolute best specialist in the craft for your exact needs.
        </p>

        {/* Hand Gesture Indicator if multiple specialists */}
        {SPECIALISTS_DATA.length > 1 && (
          <div className="mt-3.5 flex items-center justify-center gap-2 text-[11px] text-white/80 font-medium tracking-widest uppercase">
            <Hand className="w-3.5 h-3.5 text-[#D31E1E]" />
            <span>Swipe left or right to switch specialist</span>
          </div>
        )}

        {/* Artist Status Tabs (Visible only if multiple specialists) */}
        {SPECIALISTS_DATA.length > 1 && (
          <div className="mt-6 inline-flex items-center gap-2 p-1.5 bg-[#050B14]/80 border border-white/20 rounded-full backdrop-blur-md">
            {SPECIALISTS_DATA.map((specialist, idx) => {
              const isSelected = currentIndex === idx;
              return (
                <button
                  key={specialist.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#D31E1E] text-white shadow-lg shadow-[#D31E1E]/40'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{specialist.shortName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pure Hand Gesture Slider (No Infinite Loop, Bounded Left/Right Drag) */}
      <div className="relative z-10 w-full max-w-3xl mx-auto overflow-hidden touch-pan-y">
        <motion.div
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{
            type: 'spring',
            stiffness: 220,
            damping: 28,
            mass: 0.85,
          }}
          drag={SPECIALISTS_DATA.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.22}
          onDragEnd={handleDragEnd}
          className="flex w-full cursor-grab active:cursor-grabbing"
          style={{ willChange: 'transform' }}
        >
          {SPECIALISTS_DATA.map((specialist, idx) => {
            const isActive = currentIndex === idx;
            return (
              <div
                key={specialist.id}
                className="w-full shrink-0 px-2 sm:px-3 flex flex-col items-center justify-center transition-opacity duration-300"
                style={{ opacity: isActive ? 1 : 0.6 }}
              >
                {/* The Dedicated Specialist Luxury Box */}
                <div className="relative w-full bg-[#091726]/95 border border-white/15 hover:border-[#D31E1E]/50 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl shadow-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center transition-colors duration-300 overflow-hidden">
                  {/* Custom Specialist Box Background Photo if present */}
                  {specialistsBackground && (
                    <>
                      <img
                        src={specialistsBackground}
                        alt="Specialist Backdrop"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#091726] via-[#091726]/80 to-[#091726]/90 pointer-events-none" />
                    </>
                  )}

                  {/* Upload Box Backdrop Button (Visible during Unlocked Making Phase) */}
                  {!isLocked && onUploadBackground && (
                    <div className="absolute top-4 right-4 z-20">
                      <label
                        htmlFor="specialist-box-bg-input"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                      >
                        {isUploading ? (
                          <Loader2 className="w-3 h-3 animate-spin text-[#D31E1E]" />
                        ) : (
                          <Upload className="w-3 h-3 text-[#D31E1E]" />
                        )}
                        <span>{specialistsBackground ? 'Change Box Backdrop' : 'Upload Box Backdrop'}</span>
                      </label>
                    </div>
                  )}

                  {/* Corner Accent Markers */}
                  <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#D31E1E] rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#D31E1E] rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#D31E1E] rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#D31E1E] rounded-br-xl" />

                  {/* Top Subtle Ambient Crimson Line */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#D31E1E]/80 to-transparent" />

                  {/* Artist Trust Badge (No Circular DP) */}
                  <div className="mb-6 flex flex-col items-center justify-center pointer-events-none relative z-10">
                    <div className="inline-flex items-center justify-center gap-2 text-xs font-cinzel tracking-[0.2em] uppercase text-white bg-[#0F2442] border border-white/30 px-6 py-2 rounded-full shadow-lg">
                      <Award className="w-4 h-4 text-[#D31E1E]" />
                      <span className="font-semibold">{specialist.experience} ▪ {specialist.milestone}</span>
                    </div>
                  </div>

                  {/* Specialist Name & Role (Strictly Centered Inside Box) */}
                  <div className="flex flex-col items-center justify-center text-center mb-5 pointer-events-none relative z-10">
                    <h3 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal text-center drop-shadow-[0_2px_20px_rgba(0,0,0,0.85)]">
                      {specialist.name}
                    </h3>
                    <p className="text-sm sm:text-base text-[#D31E1E] tracking-widest uppercase font-semibold mt-2 text-center">
                      {specialist.role}
                    </p>
                  </div>

                  {/* Centered Story */}
                  <div className="max-w-xl mx-auto mb-6 px-2 text-center flex flex-col items-center justify-center pointer-events-none relative z-10">
                    <p className="font-normal text-base sm:text-lg text-white/95 leading-relaxed text-center text-balance italic">
                      &ldquo;{specialist.story}&rdquo;
                    </p>
                  </div>

                  {/* Specialties Strip */}
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto mb-8 px-2 pointer-events-none relative z-10">
                    {specialist.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-xs text-white/90 font-medium bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-center shadow-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Prominent Crimson Red CTA Button */}
                  <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center relative z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onConsultSpecialist(specialist);
                      }}
                      className="w-full bg-[#D31E1E] hover:bg-[#B51616] text-white rounded-full py-4 px-8 tracking-[0.2em] text-xs font-semibold transition-all duration-300 shadow-xl shadow-[#D31E1E]/30 active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>CONSULT SHREY RAJ TO GET MATCHED</span>
                      <span aria-hidden="true">&rarr;</span>
                    </button>
                    <span className="text-[11px] text-white/80 mt-2 text-center">
                      1-on-1 Consultation ▪ Shrey pairs your design with the best specialist artist
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/90 mt-2.5 tracking-wider text-center">
                      <span className="text-white/70">Direct / WhatsApp:</span>
                      <a
                        href={`https://wa.me/${specialist.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white hover:text-[#D31E1E] transition-colors underline decoration-white/30 hover:decoration-[#D31E1E]"
                      >
                        {specialist.phoneFormatted}
                      </a>
                      {specialist.secondaryPhoneFormatted && (
                        <>
                          <span className="text-white/40">▪</span>
                          <a
                            href={`https://wa.me/${specialist.secondaryPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-white hover:text-[#D31E1E] transition-colors underline decoration-white/30 hover:decoration-[#D31E1E]"
                          >
                            {specialist.secondaryPhoneFormatted}
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Pure Hand Gesture Indicator Dots (if multiple specialists) */}
      {SPECIALISTS_DATA.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          {SPECIALISTS_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === i ? 'w-8 bg-[#D31E1E]' : 'w-2.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to specialist ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
