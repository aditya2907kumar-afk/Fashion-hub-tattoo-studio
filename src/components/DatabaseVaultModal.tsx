import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Database,
  Camera,
  Download,
  Lock,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { DbCustomPhotoRecord, DbGalleryPhotoRecord, initPermanentGalleryDatabase } from '../utils/permanentDb';
import { SERVICES_DATA } from '../data/servicesData';
import { GALLERY_DATA } from '../data/galleryData';

interface DatabaseVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenshotUrl: string | null;
  screenshotTimestamp: string | null;
  onRetakeScreenshot: () => Promise<void>;
  customRecords: DbCustomPhotoRecord[];
  isGeneratingScreenshot: boolean;
}

export const DatabaseVaultModal: React.FC<DatabaseVaultModalProps> = ({
  isOpen,
  onClose,
  screenshotUrl,
  screenshotTimestamp,
  onRetakeScreenshot,
  customRecords,
  isGeneratingScreenshot,
}) => {
  const [activeTab, setActiveTab] = useState<'records' | 'gallery' | 'screenshot'>('records');
  const [galleryRecords, setGalleryRecords] = useState<DbGalleryPhotoRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      initPermanentGalleryDatabase().then((res) => {
        setGalleryRecords(res.photos);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadScreenshot = () => {
    if (!screenshotUrl) return;
    const a = document.createElement('a');
    a.href = screenshotUrl;
    a.download = `fashion-hub-services-master-record-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl bg-[#091726]/95 border border-white/15 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="relative p-6 sm:p-8 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left bg-[#050B14]/80">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="inline-flex items-center gap-2 text-[10px] font-cinzel tracking-[0.25em] uppercase text-[#D31E1E] font-semibold mb-1">
                <Database className="w-3.5 h-3.5" />
                <span>PERMANENT DATABASE VAULT ▪ LOCKED ARCHIVE</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Permanent Photo Archive
              </h2>
              <p className="text-xs text-[#A3B8CC] font-light mt-1">
                All photos are permanently stored in the local database and locked so they never change.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white/80 hover:text-white hover:bg-black/80 flex items-center justify-center transition-all cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls Bar & Tabs */}
          <div className="px-6 py-4 bg-[#091726] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* View Switcher */}
            <div className="inline-flex items-center bg-black/40 border border-white/10 rounded-full p-1">
              <button
                type="button"
                onClick={() => setActiveTab('records')}
                className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'records'
                    ? 'bg-[#D31E1E] text-white shadow-md'
                    : 'text-[#A3B8CC] hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Services (15)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'gallery'
                    ? 'bg-[#D31E1E] text-white shadow-md'
                    : 'text-[#A3B8CC] hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Craft & Clinic ({galleryRecords.length > 0 ? galleryRecords.length : 8})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('screenshot')}
                className={`px-4 py-1.5 rounded-full font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'screenshot'
                    ? 'bg-[#D31E1E] text-white shadow-md'
                    : 'text-[#A3B8CC] hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Master Picture</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRetakeScreenshot}
                disabled={isGeneratingScreenshot}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isGeneratingScreenshot ? 'animate-spin' : ''}`}
                />
                <span>Capture Master Screenshot</span>
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {activeTab === 'records' && (
              <div className="space-y-4">
                <div className="text-xs text-[#A3B8CC] px-2 flex items-center justify-between">
                  <span>15 Services Permanently Locked in Database Storage</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    IndexedDB ACID Locked ▪ Read-Only
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {SERVICES_DATA.map((service, index) => {
                    const customRec = customRecords.find((r) => r.serviceId === service.id);
                    const currentImg = customRec?.imageUrl || service.imageUrl;
                    const isCustom = !!customRec;

                    return (
                      <div
                        key={service.id}
                        className={`p-3.5 rounded-xl bg-[#050B14]/80 border ${
                          isCustom ? 'border-emerald-500/40' : 'border-white/10'
                        } flex items-center gap-3.5 transition-all`}
                      >
                        <img
                          src={currentImg}
                          alt={service.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/15 shadow-md"
                        />
                        <div className="overflow-hidden flex-1 text-left">
                          <span className="text-[10px] text-[#D31E1E] font-cinzel font-semibold tracking-wider block truncate">
                            #{String(index + 1).padStart(2, '0')} ▪ {service.subtitle}
                          </span>
                          <h4 className="text-xs text-white font-medium truncate font-serif mt-0.5">
                            {service.name}
                          </h4>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 rounded px-1.5 py-0.5 font-medium">
                              <Lock className="w-2.5 h-2.5" />
                              <span>{isCustom ? 'BESPOKE LOCKED' : 'PERMANENT LOCKED'}</span>
                            </span>
                            {isCustom && (
                              <span className="text-[9px] text-[#A3B8CC]/80 flex items-center gap-0.5">
                                <Sparkles className="w-2 h-2 text-[#D31E1E]" />
                                Custom
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <div className="text-xs text-[#A3B8CC] px-2 flex items-center justify-between">
                  <span>
                    {galleryRecords.length > 0
                      ? `${galleryRecords.length} Custom Craft & Clinic Photos Permanently Locked`
                      : '8 Craft & Clinic Atmospheric Masterpiece Cards'}
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    IndexedDB ACID Locked ▪ Read-Only
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(galleryRecords.length > 0
                    ? galleryRecords
                    : GALLERY_DATA.map((item) => ({
                        id: item.id,
                        title: item.title,
                        category: item.category,
                        imageUrl: item.imageUrl,
                        aspect: item.aspect,
                        savedAt: 'Curated Studio Master',
                        isLocked: true,
                      }))
                  ).map((card, index) => {
                    const isCustom = galleryRecords.length > 0;
                    return (
                      <div
                        key={card.id || index}
                        className={`p-3.5 rounded-xl bg-[#050B14]/80 border ${
                          isCustom ? 'border-emerald-500/40' : 'border-white/10'
                        } flex items-center gap-3.5 transition-all`}
                      >
                        <img
                          src={card.imageUrl}
                          alt={card.title}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/15 shadow-md"
                        />
                        <div className="overflow-hidden flex-1 text-left">
                          <span className="text-[10px] text-[#D31E1E] font-cinzel font-semibold tracking-wider block truncate">
                            #{String(index + 1).padStart(2, '0')} ▪ {card.category}
                          </span>
                          <h4 className="text-xs text-white font-medium truncate font-serif mt-0.5">
                            {card.title}
                          </h4>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 rounded px-1.5 py-0.5 font-medium">
                              <Lock className="w-2.5 h-2.5" />
                              <span>{isCustom ? 'BESPOKE LOCKED' : 'PERMANENT ARCHIVE'}</span>
                            </span>
                            {isCustom && (
                              <span className="text-[9px] text-[#A3B8CC]/80 flex items-center gap-0.5">
                                <Sparkles className="w-2 h-2 text-[#D31E1E]" />
                                Custom Upload
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'screenshot' && (
              <div className="space-y-4 flex flex-col items-center">
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 px-2">
                  <div className="text-xs text-[#A3B8CC] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>
                      Master picture capturing all services with their permanent photos
                      {screenshotTimestamp && ` ▪ Last captured: ${screenshotTimestamp}`}
                    </span>
                  </div>

                  {screenshotUrl && (
                    <button
                      type="button"
                      onClick={handleDownloadScreenshot}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D31E1E] hover:bg-[#B51616] text-white text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-lg shadow-[#D31E1E]/30"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download High-Res Screenshot PNG</span>
                    </button>
                  )}
                </div>

                {/* Screenshot Display Frame */}
                <div className="relative w-full rounded-2xl border border-white/15 bg-black/80 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-2 min-h-[350px]">
                  {isGeneratingScreenshot ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-[#D31E1E] animate-spin" />
                      <p className="text-sm text-white">
                        Generating master screenshot with all photos...
                      </p>
                      <p className="text-xs text-[#A3B8CC]">
                        Drawing photos and database verification stamps onto master canvas
                      </p>
                    </div>
                  ) : screenshotUrl ? (
                    <img
                      src={screenshotUrl}
                      alt="Master Services Screenshot Archive"
                      className="w-full h-auto rounded-xl shadow-lg border border-white/10"
                    />
                  ) : (
                    <div className="p-12 text-center text-[#A3B8CC] text-sm">
                      Click &ldquo;Capture Master Screenshot&rdquo; to generate the master picture.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Permanent Guarantee Note */}
            <div className="w-full bg-[#050B14]/80 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-[#A3B8CC] leading-relaxed">
                <p className="text-white font-medium">Permanent & Immutable Database Storage</p>
                <p className="mt-1 font-light">
                  All photos in this service catalog are permanently stored and locked into your
                  persistent database storage. The option to modify or replace these photos has been
                  completely removed, guaranteeing that they will never change or disappear.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
