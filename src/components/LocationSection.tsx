import React from 'react';
import { MapPin, Clock, Star, ExternalLink, ShieldCheck } from 'lucide-react';

export const LocationSection: React.FC = () => {
  return (
    <section id="location-section" className="relative w-full py-24 px-4 sm:px-8 bg-transparent overflow-hidden text-center flex flex-col items-center justify-center">

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <span className="text-[10px] sm:text-xs font-cinzel tracking-[0.25em] uppercase text-[#D31E1E] font-bold mb-2.5 text-center flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#D31E1E]" />
          KANKARBAGH SANCTUARY
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal text-center mb-6 drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
          VISIT THE STUDIO
        </h2>

        {/* Studio Rating Badge */}
        <div className="mb-6 inline-flex items-center justify-center gap-2 bg-[#0F2442]/90 border border-white/25 px-5 py-2 rounded-full text-xs text-white backdrop-blur-md shadow-lg">
          <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
          <span className="tracking-wider uppercase font-semibold text-white">
            4.9 ★ RATED STUDIO IN PATNA (714+ GOOGLE REVIEWS)
          </span>
        </div>

        {/* Opening Hours */}
        <div className="mb-6 max-w-xl mx-auto flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center justify-center gap-2 text-base text-white font-semibold">
            <Clock className="w-4 h-4 text-[#D31E1E]" />
            <span className="tracking-wider uppercase font-bold text-white">
              MONDAY – SUNDAY ▪ 10:40 AM – 9:00 PM
            </span>
          </div>
          <span className="text-xs text-white/80 mt-1 uppercase tracking-widest font-medium">
            (Open All 7 Days For Walk-Ins & Appointments)
          </span>
        </div>

        {/* Physical Address */}
        <div className="mb-10 max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
          <p className="text-lg sm:text-xl text-white font-normal leading-relaxed text-center drop-shadow-sm">
            Hanuman Nagar Rd, Near Hari Bhai Saree Waala K120, Motichoor Sweets ke upar, Kankarbagh, Bankman Colony, Patna, Bihar 800026
          </p>
          <span className="text-xs sm:text-sm text-white/80 mt-2 flex items-center justify-center gap-1.5 text-center font-medium">
            <ShieldCheck className="w-4 h-4 text-[#D31E1E]" />
            Full Air-Conditioned Sterile Suites ▪ Private Consultation Rooms
          </span>
        </div>

        {/* Action Button: OPEN IN GOOGLE MAPS */}
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <a
            href="https://maps.app.goo.gl/QRXoWwyZumn3D9PA7?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#E52222] hover:bg-[#FF2E2E] text-white rounded-full py-4 px-8 tracking-[0.2em] text-xs font-bold transition-all duration-300 shadow-xl shadow-[#E52222]/40 active:scale-95 text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>OPEN IN GOOGLE MAPS</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Interactive Dark-Themed Map Embed */}
        <div className="w-full max-w-3xl h-72 sm:h-96 rounded-3xl overflow-hidden border border-white/15 shadow-2xl relative">
          <iframe
            title="Fashion Hub Tattoo Studio Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.243555026938!2d85.149233!3d25.597371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58fce4621eb7%3A0xe7261d76eaef6b39!2sHanuman%20Nagar%20Rd%2C%20Bankman%20Colony%2C%20Patna%2C%20Bihar%20800026!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </section>
  );
};
