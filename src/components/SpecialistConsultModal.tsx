import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { Specialist, PreferredTime } from '../types';

interface SpecialistConsultModalProps {
  specialist: Specialist | null;
  onClose: () => void;
}

export const SpecialistConsultModal: React.FC<SpecialistConsultModalProps> = ({
  specialist,
  onClose,
}) => {
  const [selectedPhone, setSelectedPhone] = useState(specialist?.phone || '919334057159');
  const [customerName, setCustomerName] = useState('');
  const [preferredTime, setPreferredTime] = useState<PreferredTime>('Today');
  const [nameError, setNameError] = useState(false);

  if (!specialist) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customerName.trim();
    if (!trimmed) {
      setNameError(true);
      return;
    }

    const message = `Hey Shrey, I'm ${trimmed}! I want to get a tattoo/piercing at Fashion Hub Tattoo Studio. My preferred time is ${preferredTime}. Please guide me and match me with the best specialist for my concept!`;
    const targetPhone = selectedPhone || specialist.phone;
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg bg-[#091726] border border-[#D31E1E]/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 my-auto text-center flex flex-col items-center justify-center"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 border border-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Specialist Header */}
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <span className="text-[10px] font-cinzel tracking-[0.25em] uppercase text-[#FF4A4A] font-extrabold mb-2">
              ARTIST CONSULTATION & SPECIALIST MATCHING
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium text-center">
              Consult with Shrey Raj
            </h3>
            <p className="text-xs sm:text-sm text-white font-medium mt-1.5 text-center max-w-sm drop-shadow-sm">
              Studio Manager & Senior Specialist. Tell Shrey your design vision—he will pair you with the best specialist artist in Bihar for your exact concept and placement.
            </p>
            {specialist.secondaryPhone && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
                <span className="text-xs text-white font-bold">Connect via:</span>
                <div className="inline-flex rounded-full bg-[#050B14] p-1 border border-white/30">
                  <button
                    type="button"
                    onClick={() => setSelectedPhone(specialist.phone)}
                    className={`px-3.5 py-1 text-xs rounded-full transition-all cursor-pointer ${
                      selectedPhone === specialist.phone
                        ? 'bg-[#E52222] text-white font-black shadow-md shadow-[#E52222]/40'
                        : 'text-white hover:text-white font-bold'
                    }`}
                  >
                    {specialist.phoneFormatted}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPhone(specialist.secondaryPhone!)}
                    className={`px-3.5 py-1 text-xs rounded-full transition-all cursor-pointer ${
                      selectedPhone === specialist.secondaryPhone
                        ? 'bg-[#E52222] text-white font-black shadow-md shadow-[#E52222]/40'
                        : 'text-white hover:text-white font-bold'
                    }`}
                  >
                    {specialist.secondaryPhoneFormatted}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form (100% Strictly Centered) */}
          <form onSubmit={handleSubmit} className="w-full space-y-5 text-center flex flex-col items-center justify-center">
            {/* Customer Name */}
            <div className="w-full flex flex-col items-center justify-center text-center">
              <label htmlFor="specialist-consult-name" className="text-[11px] font-cinzel tracking-[0.2em] uppercase text-white font-bold mb-1.5 text-center">
                YOUR NAME
              </label>
              <input
                id="specialist-consult-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (nameError) setNameError(false);
                }}
                placeholder="Enter your name"
                className={`w-full bg-[#050B14] border ${
                  nameError ? 'border-[#D31E1E]' : 'border-white/30 focus:border-[#D31E1E]'
                } rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 text-center outline-none transition-all`}
              />
              {nameError && (
                <span className="text-xs text-[#FF4A4A] mt-1 text-center font-semibold">
                  Please provide your name.
                </span>
              )}
            </div>

            {/* Preferred Time */}
            <div className="w-full flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-cinzel tracking-[0.2em] uppercase text-white font-bold mb-2.5 text-center">
                PREFERRED TIME
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {(['Today', 'Tomorrow', 'This Weekend', 'Next Week', 'Not Specific Time'] as PreferredTime[]).map(
                  (timeOption) => {
                    const isSelected = preferredTime === timeOption;
                    return (
                      <button
                        key={timeOption}
                        type="button"
                        onClick={() => setPreferredTime(timeOption)}
                        className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[#E52222] text-white font-bold shadow-md shadow-[#E52222]/40'
                            : 'bg-[#050B14] text-white/90 border border-white/25 hover:border-white/40 font-medium'
                        }`}
                      >
                        {timeOption}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="w-full pt-3 flex flex-col items-center justify-center">
              <button
                type="submit"
                className="w-full bg-[#D31E1E] hover:bg-[#B51616] text-white rounded-full py-4 px-8 tracking-[0.2em] text-xs font-semibold transition-all duration-300 shadow-xl shadow-[#D31E1E]/30 active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <span>OPEN CHAT WITH {specialist.shortName.toUpperCase()}</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
              <span className="text-[10px] text-white/70 mt-2 text-center">
                Opens WhatsApp with pre-filled artist consultation details
              </span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
