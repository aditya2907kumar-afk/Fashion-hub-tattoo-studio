import React from 'react';

interface BotanicalBackdropProps {
  className?: string;
  customBackground?: string;
}

export const BotanicalBackdrop: React.FC<BotanicalBackdropProps> = ({
  className = '',
  customBackground,
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Base Dark Gradient (Only when no wallpaper is set) */}
      {!customBackground && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-[#091726] to-[#050B14]" />
      )}

      {/* Layered Tropical Foliage SVG - High Performance Clean GPU Vector Rendering */}
      <svg
        className={`absolute inset-0 w-full h-full object-cover ${customBackground ? 'opacity-20' : 'opacity-45'}`}
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="crimsonLeafGlow1" cx="30%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#D31E1E" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#871010" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#050B14" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="tealLeafGlow" cx="75%" cy="65%" r="60%">
            <stop offset="0%" stopColor="#16385C" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#0D2137" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#050B14" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="leafVein" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D31E1E" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#162A4A" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Ambient atmospheric lighting glows */}
        <circle cx="280" cy="380" r="420" fill="url(#crimsonLeafGlow1)" />
        <circle cx="1150" cy="520" r="500" fill="url(#tealLeafGlow)" />
        <circle cx="720" cy="850" r="350" fill="url(#crimsonLeafGlow1)" opacity="0.25" />

        {/* Stylized Monstera / Tropical Leaf Silhouettes on Left */}
        <g opacity="0.45" transform="translate(-100, -50) scale(1.3)">
          <path
            d="M200 120 C180 260 260 380 340 450 C380 380 430 350 420 280 C360 270 320 230 310 180 C270 180 240 140 200 120 Z"
            fill="#730E0E"
          />
          <path
            d="M340 450 C260 520 210 650 240 760 C310 710 330 650 390 610 C390 540 420 500 450 480 C400 460 370 430 340 450 Z"
            fill="#450808"
          />
          <path d="M200 120 Q350 450 240 760" stroke="url(#leafVein)" strokeWidth="2.5" />
        </g>

        {/* Tropical Leaves on Right */}
        <g opacity="0.35" transform="translate(1100, 200) scale(1.2)">
          <path
            d="M100 80 C180 180 160 320 110 420 C70 350 20 320 40 250 C90 230 110 170 100 80 Z"
            fill="#12253D"
          />
          <path
            d="M110 420 C170 510 180 620 130 730 C90 660 50 630 30 550 C60 500 70 450 110 420 Z"
            fill="#091726"
          />
          <path d="M100 80 Q140 420 130 730" stroke="#1E3E66" strokeWidth="2" />
        </g>

        {/* Dramatic Center-Right Crimson Tropical Frond */}
        <path
          d="M680 0 C740 140 850 260 980 340 C910 320 860 280 840 240 C800 230 780 170 760 120 C720 80 690 40 680 0 Z"
          fill="#941414"
          opacity="0.3"
        />
        <path
          d="M840 240 C930 360 900 500 820 620 C800 540 760 480 720 430 C760 380 780 310 840 240 Z"
          fill="#590C0C"
          opacity="0.35"
        />
      </svg>

      {/* Dark Vignette Overlay (Only when no wallpaper is set) */}
      {!customBackground && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-[#050B14]/80 pointer-events-none" />
      )}
    </div>
  );
};
