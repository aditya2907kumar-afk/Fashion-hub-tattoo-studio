import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Upload, Image as ImageIcon } from 'lucide-react';
import { ServiceItem, PreferredTime } from '../types';
import { SPECIALISTS_DATA } from '../data/specialistsData';

interface ServiceModalProps {
  service: ServiceItem | null;
  customImage?: string;
  onClose: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  customImage,
  onClose,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>(
    SPECIALISTS_DATA[0]?.id || 'shrey'
  );
  const [preferredTime, setPreferredTime] = useState<PreferredTime>('Today');
  const [nameError, setNameError] = useState(false);

  // Client reference photos for consultation inquiry
  const [referencePhotos, setReferencePhotos] = useState<string[]>([]);
  const referenceFileInputRef = useRef<HTMLInputElement>(null);

  if (!service) return null;

  const currentDisplayImage = customImage || service.imageUrl;

  // Handle uploading reference/inspiration images for consultation
  const handleReferencePhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setReferencePhotos((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeReferencePhoto = (indexToRemove: number) => {
    setReferencePhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = customerName.trim();
    if (!trimmedName) {
      setNameError(true);
      return;
    }

    const specialist = SPECIALISTS_DATA.find((s) => s.id === selectedSpecialistId) || SPECIALISTS_DATA[0];
    const photoNote = referencePhotos.length > 0
      ? ` I have prepared ${referencePhotos.length} reference photo(s) to send over this chat.`
      : '';
    const message = `Hey ${specialist.name}, I'm ${trimmedName} and I want to inquire about ${service.name} at Fashion Hub Tattoo Studio. My preferred time is ${preferredTime}.${photoNote} Please guide me with the details!`;
    const whatsappUrl = `https://wa.me/${specialist.phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Deep blur backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Hidden File Input for Reference Photos only */}
        <input
          ref={referenceFileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleReferencePhotosUpload}
        />

        {/* 2x Centered Modal Card with Spring Physics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-2xl bg-[#091726]/95 border border-white/15 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white/80 hover:text-white hover:bg-black/80 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header & Permanent Image */}
          <div className="relative w-full h-56 sm:h-64 shrink-0 overflow-hidden">
            <img
              src={currentDisplayImage}
              alt={service.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091726] via-[#091726]/40 to-transparent" />


            {/* Centered Overlay Title */}
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
              <span className="text-[10px] tracking-[0.25em] uppercase text-white font-extrabold mb-1 font-cinzel drop-shadow-md">
                {service.subtitle}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-medium text-center drop-shadow-[0_2px_16px_rgba(0,0,0,1)]">
                {service.name}
              </h2>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-center flex flex-col items-center justify-center">
            {/* Description */}
            <p className="text-sm sm:text-base text-white font-normal leading-relaxed max-w-xl text-center drop-shadow-sm">
              {service.description}
            </p>

            {/* Session Breakdown Section */}
            <div className="w-full max-w-xl bg-[#050B14]/80 border border-white/20 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center shadow-lg">
              <span className="text-[11px] font-cinzel tracking-[0.2em] uppercase text-[#FF4A4A] mb-4 text-center flex items-center justify-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#FF4A4A]" />
                SESSION PROTOCOL & STERILIZATION
              </span>

              <div className="w-full space-y-3.5 text-center flex flex-col items-center">
                {service.sessionSteps.map((step) => (
                  <div
                    key={step.number}
                    className="w-full flex flex-col items-center text-center p-3.5 rounded-xl bg-white/[0.06] border border-white/10"
                  >
                    <span className="text-xs font-bold text-white text-center flex items-center justify-center gap-1.5 drop-shadow-sm">
                      <span className="text-[#FF4A4A]">{step.number}.</span> {step.title}
                    </span>
                    <span className="text-xs text-white/95 font-medium mt-1 text-center leading-relaxed">
                      {step.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Consultation Reveal Section */}
            {!showForm ? (
              <div className="w-full max-w-md pt-2 flex flex-col items-center justify-center space-y-3">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-[#D31E1E] hover:bg-[#B51616] text-white rounded-full py-4 px-8 tracking-[0.2em] text-xs font-medium transition-all duration-300 shadow-xl shadow-[#D31E1E]/25 hover:shadow-[#D31E1E]/40 active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <span>CONSULT ON WHATSAPP</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>

                {/* Direct Upload Reference Photos shortcut */}
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(true);
                    setTimeout(() => referenceFileInputRef.current?.click(), 200);
                  }}
                  className="inline-flex items-center justify-center gap-2 text-xs text-white font-medium hover:text-[#FF4A4A] transition-colors cursor-pointer py-1"
                >
                  <Upload className="w-3.5 h-3.5 text-[#FF4A4A]" />
                  <span>Attach your reference/concept photos</span>
                </button>
              </div>
            ) : (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4 }}
                onSubmit={handleConsultSubmit}
                className="w-full max-w-lg bg-[#050B14]/90 border border-[#D31E1E]/40 rounded-2xl p-6 sm:p-7 flex flex-col items-center justify-center text-center space-y-5 shadow-2xl"
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <h3 className="font-serif text-lg text-white font-medium text-center">
                    Direct Artist Inquiry
                  </h3>
                  <p className="text-xs text-white/90 mt-1 text-center font-normal">
                    Complete your details and attach any reference photos for Shrey Raj.
                  </p>
                </div>

                {/* 1. Customer Name */}
                <div className="w-full flex flex-col items-center justify-center text-center">
                  <label htmlFor="service-consult-name" className="text-[11px] font-cinzel tracking-[0.2em] uppercase text-white font-bold mb-1.5 text-center">
                    YOUR NAME
                  </label>
                  <input
                    id="service-consult-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (nameError) setNameError(false);
                    }}
                    placeholder="Enter your full name"
                    className={`w-full max-w-md bg-[#091726] border ${
                      nameError ? 'border-[#D31E1E]' : 'border-white/30 focus:border-[#D31E1E]'
                    } rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 text-center outline-none transition-all`}
                  />
                  {nameError && (
                    <span className="text-xs text-[#FF4A4A] mt-1 text-center font-semibold">
                      Please enter your name to proceed.
                    </span>
                  )}
                </div>

                {/* 2. Upload Reference / Concept Photos */}
                <div className="w-full flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-cinzel tracking-[0.2em] uppercase text-white font-bold mb-2 text-center flex items-center justify-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#FF4A4A]" />
                    UPLOAD REFERENCE PHOTOS (OPTIONAL)
                  </span>

                  {/* Upload Dropzone / Button */}
                  <div
                    onClick={() => referenceFileInputRef.current?.click()}
                    className="w-full max-w-md border border-dashed border-white/35 hover:border-[#FF4A4A] bg-[#091726]/80 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#091726]"
                  >
                    <Upload className="w-5 h-5 text-[#FF4A4A] mb-1.5" />
                    <span className="text-xs font-semibold text-white">Click to choose photos from device</span>
                    <span className="text-[10px] text-white/80 mt-0.5">
                      Upload design references, sketches, or photos of your skin/placement
                    </span>
                  </div>

                  {/* Uploaded Reference Photos Previews */}
                  {referencePhotos.length > 0 && (
                    <div className="mt-3 w-full max-w-md flex flex-wrap items-center justify-center gap-2.5">
                      {referencePhotos.map((photoUrl, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 group shadow-md"
                        >
                          <img
                            src={photoUrl}
                            alt={`Reference ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeReferencePhoto(idx);
                            }}
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/80 text-white hover:bg-[#D31E1E] flex items-center justify-center transition-colors cursor-pointer"
                            title="Remove photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <div className="w-full text-center">
                        <span className="text-xs text-white font-bold drop-shadow-sm">
                          {referencePhotos.length} reference photo(s) selected
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Select Specialist */}
                <div className="w-full flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-cinzel tracking-[0.2em] uppercase text-white font-bold mb-2 text-center">
                    SELECT SPECIALIST
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                    {SPECIALISTS_DATA.map((specialist) => {
                      const isSelected = selectedSpecialistId === specialist.id;
                      return (
                        <button
                          key={specialist.id}
                          type="button"
                          onClick={() => setSelectedSpecialistId(specialist.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center ${
                            isSelected
                              ? 'bg-[#162A4A] border-[#D31E1E] text-white shadow-lg shadow-[#D31E1E]/25'
                              : 'bg-[#091726] border-white/20 hover:border-white/40 text-white font-medium'
                          }`}
                        >
                          <span className="text-xs font-bold text-white text-center">
                            {specialist.name}
                          </span>
                          <span className="text-[11px] text-white font-normal mt-0.5 text-center">
                            {specialist.role}
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
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-md">
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
                                ? 'bg-[#D31E1E] text-white font-medium shadow-md shadow-[#D31E1E]/25'
                                : 'bg-[#091726] text-white/90 border border-white/20 hover:border-white/40'
                            }`}
                          >
                            {timeOption}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Submit to WhatsApp */}
                <div className="w-full pt-2 flex flex-col items-center justify-center">
                  <button
                    type="submit"
                    className="w-full max-w-md bg-[#D31E1E] hover:bg-[#B51616] text-white rounded-full py-4 px-8 tracking-[0.2em] text-xs font-semibold transition-all duration-300 shadow-xl shadow-[#D31E1E]/30 active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <span>OPEN IN WHATSAPP CHAT</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </motion.form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
