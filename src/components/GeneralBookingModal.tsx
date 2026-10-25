import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { SPECIALISTS_DATA } from '../data/specialistsData';
import { PreferredTime } from '../types';

export const BOOKING_SERVICES = [
  'All Types of Tattoos',
  'Ear Piercing',
  'Nose Piercing',
  'Lip Piercing',
  'Tongue Piercing',
  'Naval Piercing',
];

interface GeneralBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeneralBookingModal: React.FC<GeneralBookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [selectedService, setSelectedService] = useState(BOOKING_SERVICES[0]);
  const [selectedSpecialistId, setSelectedSpecialistId] = useState(
    SPECIALISTS_DATA[0]?.id || 'shrey'
  );
  const [preferredTime, setPreferredTime] = useState<PreferredTime>('Today');
  const [nameError, setNameError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customerName.trim();
    if (!trimmed) {
      setNameError(true);
      return;
    }

    const specialist = SPECIALISTS_DATA.find((s) => s.id === selectedSpecialistId) || SPECIALISTS_DATA[0];
    const message = `Hey Shrey, I'm ${trimmed} and I want to inquire about ${selectedService} at Fashion Hub Tattoo Studio. My preferred time is ${preferredTime}. Please guide me and help me get matched with the best specialist for this!`;
    const whatsappUrl = `https://wa.me/${specialist.phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
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

          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <span className="text-[11px] font-cinzel tracking-[0.25em] uppercase text-[#FF4A4A] font-black mb-2">
              FASHION HUB INK & PIERCING
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold text-center">
              Direct Artist Booking
            </h3>
            <p className="text-xs sm:text-sm text-white font-medium mt-1.5 text-center max-w-sm drop-shadow-sm">
              Connect with our master artists instantly on WhatsApp for consultation, appointments, or custom quotes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4 text-center flex flex-col items-center justify-center">
            {/* 1. Name */}
            <div className="w-full flex flex-col items-center justify-center text-center">
              <label htmlFor="general-booking-name" className="text-[11px] font-cinzel tracking-[0.2em] uppercase text-white font-bold mb-1 text-center">
                YOUR NAME
              </label>
              <input
                id="general-booking-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (nameError) setNameError(false);
                }}
                placeholder="Enter your full name"
                className={`w-full bg-[#050B14] border ${
                  nameError ? 'border-[#D31E1E]' : 'border-white/25 focus:border-[#D31E1E]'
                } rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 text-center outline-none transition-all font-medium`}
              />
              {nameError && (
                <span className="text-xs text-[#D31E1E] mt-1 text-center font-medium">
                  Please enter your name.
                </span>
              )}
            </div>

            {/* 2. Select Service */}
            <div className="w-full flex flex-col items-center justify-center text-center">
              <label htmlFor="general-booking-service" className="text-[11px] font-cinzel tracking-[0.2em] uppercase text-white font-bold mb-1 text-center">
                DESIRED SERVICE
              </label>
              <select
                id="general-booking-service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-[#050B14] border border-white/25 focus:border-[#D31E1E] rounded-xl px-4 py-3 text-xs sm:text-sm text-white text-center outline-none cursor-pointer font-medium"
              >
                {BOOKING_SERVICES.map((serviceName) => (
                  <option key={serviceName} value={serviceName} className="bg-[#091726] text-white">
                    {serviceName}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Select Specialist & Consultation */}
            <div className="w-full flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-cinzel tracking-[0.2em] uppercase text-white font-bold mb-1.5 text-center">
                CONSULTATION & SPECIALIST MATCHING
              </span>
              <div className="grid gap-2.5 w-full grid-cols-1 max-w-md">
                {SPECIALISTS_DATA.map((specialist) => {
                  const isSelected = selectedSpecialistId === specialist.id;
                  return (
                    <button
                      key={specialist.id}
                      type="button"
                      onClick={() => setSelectedSpecialistId(specialist.id)}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D31E1E]/20 border-[#D31E1E] text-white'
                          : 'bg-[#050B14] border-white/20 text-white/90 hover:border-white/40'
                      }`}
                    >
                      <span className="text-xs font-semibold text-white flex items-center justify-center gap-1.5 text-center">
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#D31E1E]" />}
                        {specialist.name} (Studio Manager & Senior Specialist)
                      </span>
                      <span className="text-[11px] text-white/80 font-normal mt-0.5 text-center">
                        Evaluates your vision & brings in the best specialist artist for your concept
                      </span>
                      <span className="text-[10px] text-white/70 mt-0.5 text-center">
                        {specialist.phoneFormatted}
                        {specialist.secondaryPhoneFormatted && ` ▪ ${specialist.secondaryPhoneFormatted}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Preferred Time */}
            <div className="w-full flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-cinzel tracking-[0.2em] uppercase text-white font-bold mb-2 text-center">
                PREFERRED TIME
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {(['Today', 'Tomorrow', 'This Weekend', 'Next Week', 'Not Specific Time'] as PreferredTime[]).map(
                  (timeOption) => {
                    const isSelected = preferredTime === timeOption;
                    return (
                      <button
                        key={timeOption}
                        type="button"
                        onClick={() => setPreferredTime(timeOption)}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer text-center ${
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

            {/* Submit */}
            <div className="w-full pt-3 flex flex-col items-center justify-center">
              <button
                type="submit"
                className="w-full bg-[#D31E1E] hover:bg-[#B51616] text-white rounded-full py-4 px-8 tracking-[0.2em] text-xs font-semibold transition-all duration-300 shadow-xl shadow-[#D31E1E]/30 active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <span>OPEN CHAT ON WHATSAPP</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
