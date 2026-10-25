import React, { useState, useRef, useEffect } from 'react';
import { GALLERY_DATA } from '../data/galleryData';
import { GalleryItem } from '../types';
import { Camera, Upload, Lock, Loader2, Instagram, ExternalLink } from 'lucide-react';
import { optimizeImageFile, savePermanentGalleryPhotos, DbGalleryPhotoRecord } from '../utils/permanentDb';

interface BusinessGalleryProps {
  items?: GalleryItem[];
  isLocked?: boolean;
  onUpdateGallery?: (items: GalleryItem[]) => void;
  onSaveAndLock?: () => Promise<void>;
}

export const BusinessGallery: React.FC<BusinessGalleryProps> = ({
  items,
  isLocked = true,
  onUpdateGallery,
  onSaveAndLock,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalItems, setInternalItems] = useState<GalleryItem[]>(items || GALLERY_DATA);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedUploads, setHasUnsavedUploads] = useState<boolean>(false);

  useEffect(() => {
    if (items && items.length > 0) {
      setInternalItems(items);
    }
  }, [items]);

  // Base list of items
  const baseItems = internalItems.length > 0 ? internalItems : GALLERY_DATA;

  // Lean 8-item track (~2,720px wide per track), perfectly spanning displays with zero lag or duplicate DOM bloat
  const trackItems = baseItems.slice(0, 8);

  // Multi-file upload handler
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const fileList = Array.from(files).slice(0, 8);
      const optimizedUrls = await Promise.all(
        fileList.map((file) => optimizeImageFile(file, 1400, 0.9))
      );

      const newItems: GalleryItem[] = optimizedUrls.map((dataUrl, idx) => {
        const fallback = internalItems[idx] || GALLERY_DATA[idx] || {
          id: `gal-${idx + 1}`,
          title: `Craft Masterpiece #${idx + 1}`,
          category: 'Studio Craft',
          aspect: 'aspect-square',
        };
        return {
          id: `gal-${idx + 1}`,
          title: fallback.title,
          category: fallback.category,
          aspect: 'aspect-square',
          imageUrl: dataUrl,
          isCustom: true,
        };
      });

      setInternalItems(newItems);
      if (onUpdateGallery) {
        onUpdateGallery(newItems);
      }
      setHasUnsavedUploads(true);
    } catch (err) {
      console.error('Error optimizing uploaded gallery images:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Permanently save and lock gallery photos
  const handleSaveAndLockPermanently = async () => {
    setIsSaving(true);
    try {
      if (onSaveAndLock) {
        await onSaveAndLock();
      } else {
        const recordsToSave: DbGalleryPhotoRecord[] = internalItems.map((item, idx) => ({
          id: item.id || `gal-${idx + 1}`,
          title: item.title,
          category: item.category,
          imageUrl: item.imageUrl,
          aspect: item.aspect || 'aspect-square',
          savedAt: new Date().toISOString(),
          isLocked: true,
        }));
        await savePermanentGalleryPhotos(recordsToSave);
      }
      setHasUnsavedUploads(false);
    } catch (err) {
      console.error('Error permanently saving gallery photos:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="relative w-full py-20 bg-transparent overflow-hidden">
      {/* Centered Section Header */}
      <div className="max-w-4xl mx-auto px-6 mb-12 text-center flex flex-col items-center justify-center">
        <span className="text-[10px] sm:text-xs font-cinzel tracking-[0.25em] uppercase text-[#FF4A4A] mb-2.5 text-center flex items-center justify-center gap-1.5 font-extrabold drop-shadow-[0_0_12px_rgba(255,74,74,0.8)]">
          <Camera className="w-3.5 h-3.5 text-[#FF4A4A]" />
          STUDIO SANCTUARY & MASTER PORTFOLIO
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-medium text-center drop-shadow-[0_4px_28px_rgba(0,0,0,1)]">
          Craft & Clinic Atmosphere
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white font-medium mt-3 max-w-lg mx-auto text-center leading-relaxed drop-shadow-[0_2px_14px_rgba(0,0,0,1)]">
          Autoclave hospital-grade sterilization meets artisanal luxury. Glimpses of daily creations and sterile suites in Kankarbagh, Patna.
        </p>

        {/* Instagram Feed Discovery Badge */}
        <div className="mt-5 flex items-center justify-center">
          <a
            href="https://www.instagram.com/fashion_hub_tattoo_studio_?dlrf=MXI3dTF6dDA2MDJmYg=="
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#833AB4]/25 via-[#FD1D1D]/25 to-[#FCAF45]/25 hover:from-[#833AB4]/40 hover:via-[#FD1D1D]/40 hover:to-[#FCAF45]/40 border border-pink-500/40 hover:border-pink-500/70 text-white text-xs font-semibold tracking-wider transition-all duration-300 shadow-xl shadow-pink-950/30 active:scale-95 cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-[#E1306C] group-hover:scale-110 transition-transform" />
            <span>Follow Live Inks On Instagram: <strong className="text-pink-200 font-bold group-hover:underline">@fashion_hub_tattoo_studio_</strong></span>
            <ExternalLink className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
          </a>
        </div>

        {/* Upload & Lock Controls Bar (Visible only when NOT locked) */}
        {!isLocked && (
          <div className="mt-6 flex flex-col items-center justify-center">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesSelected}
                className="hidden"
                id="gallery-multi-upload"
              />

              <label
                htmlFor="gallery-multi-upload"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/40 hover:border-white/70 text-white text-xs font-bold tracking-wider uppercase transition-all cursor-pointer shadow-xl active:scale-95"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FF3838]" />
                    <span>Processing Photos...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-[#FF3838]" />
                    <span>Upload Craft & Clinic Photos</span>
                  </>
                )}
              </label>

              {hasUnsavedUploads && (
                <button
                  type="button"
                  onClick={handleSaveAndLockPermanently}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E52222] hover:bg-[#FF2E2E] text-white text-xs font-bold tracking-wider uppercase transition-all cursor-pointer shadow-xl shadow-[#E52222]/40 border border-[#FF3838] active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Locking to Database...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Save and Lock Permanently</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 100% Glitch-Free Seamless Twin-Track Continuous Marquee (Zero Left Cutoff, Zero Jump) */}
      <div className="w-full overflow-hidden select-none py-2 relative marquee-container">
        <div className="flex w-max">
          {/* Primary Track */}
          <div className="flex shrink-0 items-center gap-5 sm:gap-6 pr-5 sm:pr-6 animate-gallery-marquee">
            {trackItems.map((item, idx) => (
              <div
                key={`track-a-${item.id}-${idx}`}
                className="group flex-shrink-0 w-64 sm:w-72 h-80 rounded-2xl overflow-hidden bg-black/50 border border-white/20 hover:border-[#FF3838] relative shadow-2xl transition-all duration-300"
                style={{ contain: 'layout style paint' }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Craft and clinic studio photo'}
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 pointer-events-none group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* Seamless Duplicate Track (Pixel-for-pixel continuous wrap) */}
          <div
            className="flex shrink-0 items-center gap-5 sm:gap-6 pr-5 sm:pr-6 animate-gallery-marquee"
            aria-hidden="true"
          >
            {trackItems.map((item, idx) => (
              <div
                key={`track-b-${item.id}-${idx}`}
                className="group flex-shrink-0 w-64 sm:w-72 h-80 rounded-2xl overflow-hidden bg-black/50 border border-white/20 hover:border-[#FF3838] relative shadow-2xl transition-all duration-300"
                style={{ contain: 'layout style paint' }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Craft and clinic studio photo'}
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 pointer-events-none group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
