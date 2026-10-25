import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Lock,
  Sparkles,
  CheckCircle,
  X,
  Layers,
  Image as ImageIcon,
  UserCheck,
  Globe,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { GalleryItem } from '../types';
import { optimizeImageFile } from '../utils/permanentDb';

interface WebsitePhotoStudioDrawerProps {
  isLocked: boolean;
  servicesImages: Record<string, string>;
  galleryItems: GalleryItem[];
  specialistsBackground: string;
  websiteBackground: string;
  onUpdateServicesImages: (images: Record<string, string>) => void;
  onUpdateGalleryItems: (items: GalleryItem[]) => void;
  onUpdateSpecialistsBackground: (bg: string) => void;
  onUpdateWebsiteBackground: (bg: string) => void;
  onSaveAndLockPermanently: () => Promise<void>;
  isSaving: boolean;
}

export const WebsitePhotoStudioDrawer: React.FC<WebsitePhotoStudioDrawerProps> = ({
  isLocked,
  servicesImages,
  galleryItems,
  specialistsBackground,
  websiteBackground,
  onUpdateServicesImages,
  onUpdateGalleryItems,
  onUpdateSpecialistsBackground,
  onUpdateWebsiteBackground,
  onSaveAndLockPermanently,
  isSaving,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'services' | 'specialists' | 'website'>('gallery');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Hidden file inputs
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const servicesMultiInputRef = useRef<HTMLInputElement>(null);
  const singleServiceInputRef = useRef<HTMLInputElement>(null);
  const [targetSingleServiceId, setTargetSingleServiceId] = useState<string | null>(null);
  const specialistsBgInputRef = useRef<HTMLInputElement>(null);
  const websiteBgInputRef = useRef<HTMLInputElement>(null);

  if (isLocked) {
    return null; // Permanently hidden when locked
  }

  // Handle Craft & Clinic batch upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    try {
      const fileList = Array.from(files).slice(0, 8);
      const optimizedUrls = await Promise.all(
        fileList.map((file) => optimizeImageFile(file, 1400, 0.9))
      );

      const updated: GalleryItem[] = optimizedUrls.map((url, idx) => {
        const existing = galleryItems[idx] || {
          id: `gal-${idx + 1}`,
          title: `Craft Masterpiece #${idx + 1}`,
          category: 'Studio Craft',
          aspect: 'aspect-square',
        };
        return {
          id: `gal-${idx + 1}`,
          title: existing.title,
          category: existing.category,
          aspect: 'aspect-square',
          imageUrl: url,
          isCustom: true,
        };
      });

      onUpdateGalleryItems(updated);
    } catch (err) {
      console.error('Gallery upload error:', err);
    } finally {
      setIsProcessing(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  // Handle Multi Services upload
  const handleServicesMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    try {
      const fileList = Array.from(files);
      const optimizedUrls = await Promise.all(
        fileList.map((file) => optimizeImageFile(file, 1400, 0.9))
      );

      const nextMap = { ...servicesImages };
      SERVICES_DATA.slice(0, optimizedUrls.length).forEach((srv, idx) => {
        if (optimizedUrls[idx]) {
          nextMap[srv.id] = optimizedUrls[idx];
        }
      });

      onUpdateServicesImages(nextMap);
    } catch (err) {
      console.error('Services batch upload error:', err);
    } finally {
      setIsProcessing(false);
      if (servicesMultiInputRef.current) servicesMultiInputRef.current.value = '';
    }
  };

  // Handle Single Service upload
  const handleSingleServiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetSingleServiceId) return;

    setIsProcessing(true);
    try {
      const optimized = await optimizeImageFile(file, 1400, 0.9);
      onUpdateServicesImages({
        ...servicesImages,
        [targetSingleServiceId]: optimized,
      });
    } catch (err) {
      console.error('Single service upload error:', err);
    } finally {
      setIsProcessing(false);
      setTargetSingleServiceId(null);
      if (singleServiceInputRef.current) singleServiceInputRef.current.value = '';
    }
  };

  // Handle Specialists Box Background upload
  const handleSpecialistsBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const optimized = await optimizeImageFile(file, 1800, 0.9);
      onUpdateSpecialistsBackground(optimized);
    } catch (err) {
      console.error('Specialists background upload error:', err);
    } finally {
      setIsProcessing(false);
      if (specialistsBgInputRef.current) specialistsBgInputRef.current.value = '';
    }
  };

  // Handle Website Overall Background upload
  const handleWebsiteBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const optimized = await optimizeImageFile(file, 2000, 0.9);
      onUpdateWebsiteBackground(optimized);
    } catch (err) {
      console.error('Website background upload error:', err);
    } finally {
      setIsProcessing(false);
      if (websiteBgInputRef.current) websiteBgInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Hidden Global Inputs */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleGalleryUpload}
        className="hidden"
      />
      <input
        ref={servicesMultiInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleServicesMultiUpload}
        className="hidden"
      />
      <input
        ref={singleServiceInputRef}
        type="file"
        accept="image/*"
        onChange={handleSingleServiceUpload}
        className="hidden"
      />
      <input
        ref={specialistsBgInputRef}
        type="file"
        accept="image/*"
        onChange={handleSpecialistsBgUpload}
        className="hidden"
      />
      <input
        ref={websiteBgInputRef}
        type="file"
        accept="image/*"
        onChange={handleWebsiteBgUpload}
        className="hidden"
      />

      {/* Floating Bottom Bar (Always accessible during making phase) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-[#091726]/95 hover:bg-[#0D2137] border border-[#D31E1E]/50 hover:border-[#D31E1E] text-white px-5 py-3 rounded-full shadow-2xl shadow-black/80 backdrop-blur-md transition-all duration-300 cursor-pointer active:scale-95"
        >
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute inset-0 animate-ping opacity-75" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-cinzel tracking-[0.2em] uppercase text-[#D31E1E] font-bold">
              Website Making Phase
            </span>
            <span className="text-xs font-medium text-white flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#D31E1E]" />
              Manage & Lock Custom Photos
            </span>
          </div>
          <span className="ml-2 text-xs bg-[#D31E1E] text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Edit Mode
          </span>
        </button>
      </div>

      {/* Main Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#091726] border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#050B14]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D31E1E]/20 border border-[#D31E1E]/40 flex items-center justify-center text-[#D31E1E]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-serif text-white font-medium">
                    Permanent Photo Customizer
                  </h3>
                  <p className="text-xs text-[#A3B8CC]">
                    Upload photos for your 4 target sections, then lock permanently when satisfied.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-[#071321] px-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`py-3 px-4 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                  activeTab === 'gallery'
                    ? 'border-[#D31E1E] text-white bg-white/5'
                    : 'border-transparent text-[#A3B8CC] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#D31E1E]" />
                <span>1. Craft & Clinic (8 Slots)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('services')}
                className={`py-3 px-4 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                  activeTab === 'services'
                    ? 'border-[#D31E1E] text-white bg-white/5'
                    : 'border-transparent text-[#A3B8CC] hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#D31E1E]" />
                <span>2. Services Catalog</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('specialists')}
                className={`py-3 px-4 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                  activeTab === 'specialists'
                    ? 'border-[#D31E1E] text-white bg-white/5'
                    : 'border-transparent text-[#A3B8CC] hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-[#D31E1E]" />
                <span>3. Specialists Box Backdrop</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('website')}
                className={`py-3 px-4 text-xs font-semibold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 cursor-pointer shrink-0 ${
                  activeTab === 'website'
                    ? 'border-[#D31E1E] text-white bg-white/5'
                    : 'border-transparent text-[#A3B8CC] hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[#D31E1E]" />
                <span>4. Overall Site Background</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto max-h-[50vh] space-y-6">
              {/* TAB 1: CRAFT & CLINIC */}
              {activeTab === 'gallery' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Craft & Clinic Atmosphere Gallery</h4>
                      <p className="text-xs text-[#A3B8CC] mt-1">
                        Select multiple photos at once. They will automatically replace the 8 gallery marquee cards.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-2 bg-[#D31E1E] hover:bg-[#B51616] text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-md shrink-0 active:scale-95 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Upload Gallery Photos</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="relative rounded-xl overflow-hidden aspect-square bg-[#050B14] border border-white/10 group"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                          <span className="text-[10px] text-white font-semibold">Slot #{idx + 1}</span>
                          <span className="text-[9px] text-[#A3B8CC] truncate w-full">{item.title}</span>
                          {item.isCustom && (
                            <span className="mt-1 text-[8px] bg-[#D31E1E] text-white px-2 py-0.5 rounded-full">
                              Custom
                            </span>
                          )}
                        </div>
                        {item.isCustom && (
                          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: SERVICES */}
              {activeTab === 'services' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Artisanal Services Catalog Photos</h4>
                      <p className="text-xs text-[#A3B8CC] mt-1">
                        Batch upload multiple photos to sequentially fill services, or click any card below to replace individually.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => servicesMultiInputRef.current?.click()}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-2 bg-[#D31E1E] hover:bg-[#B51616] text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-md shrink-0 active:scale-95 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Batch Upload Services</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {SERVICES_DATA.map((srv) => {
                      const img = servicesImages[srv.id] || srv.imageUrl;
                      const isCustom = Boolean(servicesImages[srv.id]);

                      return (
                        <div
                          key={srv.id}
                          onClick={() => {
                            setTargetSingleServiceId(srv.id);
                            singleServiceInputRef.current?.click();
                          }}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#D31E1E]/50 transition-colors cursor-pointer group"
                        >
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#050B14]">
                            <img src={img} alt={srv.name} className="w-full h-full object-cover" />
                            {isCustom && (
                              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs text-white font-medium truncate">{srv.name}</h5>
                            <span className="text-[10px] text-[#A3B8CC] block">{srv.subtitle}</span>
                            <span className="text-[10px] text-[#D31E1E] group-hover:underline">
                              {isCustom ? 'Replace Custom Photo' : 'Upload Custom Photo'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: SPECIALISTS BACKGROUND */}
              {activeTab === 'specialists' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Specialists Showcase Box Backdrop</h4>
                      <p className="text-xs text-[#A3B8CC] mt-1">
                        Upload a bespoke background image that sits subtly inside the specialist luxury container card.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => specialistsBgInputRef.current?.click()}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-2 bg-[#D31E1E] hover:bg-[#B51616] text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-md shrink-0 active:scale-95 disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{specialistsBackground ? 'Change Background' : 'Upload Box Background'}</span>
                    </button>
                  </div>

                  <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-[#050B14] border border-white/10 flex items-center justify-center text-center p-6">
                    {specialistsBackground ? (
                      <>
                        <img
                          src={specialistsBackground}
                          alt="Specialists Backdrop Preview"
                          className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#091726] via-transparent to-[#091726]/80" />
                        <div className="relative z-10 flex flex-col items-center">
                          <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
                          <span className="text-sm font-semibold text-white">Custom Backdrop Active</span>
                          <span className="text-xs text-[#A3B8CC]">Renders inside artist showcase cards</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-[#A3B8CC]">
                        <UserCheck className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs">No custom background set (using default dark studio glass)</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: WEBSITE BACKGROUND */}
              {activeTab === 'website' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Overall Website Background Atmosphere</h4>
                      <p className="text-xs text-[#A3B8CC] mt-1">
                        Upload a full-bleed studio photo that sits behind the entire website with atmospheric dark shading.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => websiteBgInputRef.current?.click()}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-2 bg-[#D31E1E] hover:bg-[#B51616] text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-md shrink-0 active:scale-95 disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{websiteBackground ? 'Change Background' : 'Upload Site Background'}</span>
                    </button>
                  </div>

                  <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-[#050B14] border border-white/10 flex items-center justify-center text-center p-6">
                    {websiteBackground ? (
                      <>
                        <img
                          src={websiteBackground}
                          alt="Website Background Preview"
                          className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-[#050B14]/80" />
                        <div className="relative z-10 flex flex-col items-center">
                          <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
                          <span className="text-sm font-semibold text-white">Custom Full-Site Atmosphere Active</span>
                          <span className="text-xs text-[#A3B8CC]">Blended smoothly behind all page sections</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-[#A3B8CC]">
                        <Globe className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs">No custom background set (using default dark botanical vector)</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with One-Time Save & Lock */}
            <div className="p-5 sm:p-6 border-t border-white/10 bg-[#050B14] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#A3B8CC]">
                <span className="text-white font-medium">Ready to finalize?</span> When you save and lock, your photos become permanent site files and this editor will disappear completely.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs text-[#A3B8CC] hover:text-white transition-colors cursor-pointer w-full sm:w-auto text-center"
                >
                  Keep Testing
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full bg-[#D31E1E] hover:bg-[#B51616] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-lg shadow-[#D31E1E]/40 border border-[#D31E1E] cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Writing Permanent Files...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Save & Lock Permanently</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#091726] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#D31E1E]/20 border border-[#D31E1E]/50 flex items-center justify-center text-[#D31E1E] mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="font-serif text-2xl text-white font-medium mb-2">
              Lock Website Permanently?
            </h3>
            <p className="text-xs sm:text-sm text-[#A3B8CC] mb-6 leading-relaxed">
              This will write your custom photos directly onto the server disk and static manifest file.
              <br /><br />
              <strong className="text-white">All upload buttons, maker tools, and this editor will be permanently removed</strong> from the live site so no further edits can accidentally happen.
            </p>

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSaving}
                className="flex-1 py-3 rounded-full border border-white/10 hover:bg-white/10 text-white text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowConfirmModal(false);
                  await onSaveAndLockPermanently();
                }}
                disabled={isSaving}
                className="flex-1 py-3 rounded-full bg-[#D31E1E] hover:bg-[#B51616] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-xl shadow-[#D31E1E]/40 border border-[#D31E1E] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>Yes, Lock Forever</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
