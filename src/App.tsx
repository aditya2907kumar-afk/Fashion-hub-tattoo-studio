/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { HeroSection } from './components/HeroSection';
import { ServicesCarousel } from './components/ServicesCarousel';
import { ServiceModal } from './components/ServiceModal';
import { BusinessGallery } from './components/BusinessGallery';
import { ReviewsMarquee } from './components/ReviewsMarquee';
import { SpecialistsShowcase } from './components/SpecialistsShowcase';
import { SpecialistConsultModal } from './components/SpecialistConsultModal';
import { LocationSection } from './components/LocationSection';
import { StudioFooter } from './components/StudioFooter';
import { GeneralBookingModal } from './components/GeneralBookingModal';
import { DatabaseVaultModal } from './components/DatabaseVaultModal';
import { WebsitePhotoStudioDrawer } from './components/WebsitePhotoStudioDrawer';
import { ServiceItem, Specialist, GalleryItem } from './types';
import { GALLERY_DATA } from './data/galleryData';
import defaultAssets from './data/permanentWebsiteAssets.json';
import {
  fetchServerAssets,
  saveAndLockAllWebsiteAssets,
  DbCustomPhotoRecord,
} from './utils/permanentDb';
import { generateServicesMasterScreenshot } from './utils/screenshotGenerator';

export default function App() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [consultingSpecialist, setConsultingSpecialist] = useState<Specialist | null>(null);
  const [isGeneralBookingOpen, setIsGeneralBookingOpen] = useState(false);
  const [isDatabaseVaultOpen, setIsDatabaseVaultOpen] = useState(false);

  // Authoritative persistent website assets (Services, Craft & Clinic, Specialists BG, Website BG)
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [customServiceImages, setCustomServiceImages] = useState<Record<string, string>>(
    (defaultAssets.services as Record<string, string>) || {}
  );
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    defaultAssets.gallery && defaultAssets.gallery.length > 0
      ? (defaultAssets.gallery as GalleryItem[])
      : GALLERY_DATA
  );
  const [specialistsBackground, setSpecialistsBackground] = useState<string>(
    defaultAssets.specialistsBackground || ''
  );
  const [websiteBackground, setWebsiteBackground] = useState<string>(
    defaultAssets.websiteBackground || '/uploads/website-bg.jpg'
  );
  const [isSavingLocked, setIsSavingLocked] = useState<boolean>(false);

  // Master screenshot archive for services
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [screenshotTimestamp, setScreenshotTimestamp] = useState<string | null>(null);
  const [isGeneratingScreenshot, setIsGeneratingScreenshot] = useState(false);
  const [customRecords, setCustomRecords] = useState<DbCustomPhotoRecord[]>([]);

  // Initialize and load permanent website assets from server on mount
  useEffect(() => {
    let isMounted = true;

    async function loadAuthoritativeAssets() {
      try {
        const manifest = await fetchServerAssets();
        if (!isMounted) return;

        setIsLocked(Boolean(manifest.isLocked));
        if (manifest.services && Object.keys(manifest.services).length > 0) {
          setCustomServiceImages(manifest.services);
        }
        if (manifest.gallery && manifest.gallery.length > 0) {
          setGalleryItems(manifest.gallery as GalleryItem[]);
        }
        if (manifest.specialistsBackground) {
          setSpecialistsBackground(manifest.specialistsBackground);
        }
        if (manifest.websiteBackground) {
          setWebsiteBackground(manifest.websiteBackground);
        }
      } catch (err) {
        console.warn('Initial server asset bootstrap issue:', err);
      }
    }

    loadAuthoritativeAssets();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save and lock all assets permanently to server disk and static manifest
  const handleSaveAndLockPermanently = useCallback(async () => {
    setIsSavingLocked(true);
    try {
      const updatedManifest = await saveAndLockAllWebsiteAssets({
        services: customServiceImages,
        gallery: galleryItems,
        specialistsBackground,
        websiteBackground,
      });

      setIsLocked(true);
      if (updatedManifest.services) {
        setCustomServiceImages(updatedManifest.services);
      }
      if (updatedManifest.gallery && updatedManifest.gallery.length > 0) {
        setGalleryItems(updatedManifest.gallery as GalleryItem[]);
      }
      if (updatedManifest.specialistsBackground) {
        setSpecialistsBackground(updatedManifest.specialistsBackground);
      }
      if (updatedManifest.websiteBackground) {
        setWebsiteBackground(updatedManifest.websiteBackground);
      }

      // Generate final screenshot for archival
      await handleGenerateScreenshot(updatedManifest.services || customServiceImages);
    } catch (err) {
      console.error('Failed to save and lock assets permanently:', err);
    } finally {
      setIsSavingLocked(false);
    }
  }, [customServiceImages, galleryItems, specialistsBackground, websiteBackground]);

  // Generate master screenshot picture of all services
  const handleGenerateScreenshot = useCallback(async (currentMap: Record<string, string>) => {
    setIsGeneratingScreenshot(true);
    try {
      const result = await generateServicesMasterScreenshot({
        customImages: currentMap,
      });
      setScreenshotUrl(result.dataUrl);
      setScreenshotTimestamp(result.timestamp);
    } catch (err) {
      console.warn('Screenshot generation issue:', err);
    } finally {
      setIsGeneratingScreenshot(false);
    }
  }, []);

  // Open database vault and ensure screenshot is captured
  const handleOpenDatabaseVault = async () => {
    setIsDatabaseVaultOpen(true);
    if (!screenshotUrl) {
      await handleGenerateScreenshot(customServiceImages);
    }
  };

  // Prevent background scroll jitter when any modal is open
  useEffect(() => {
    const isAnyModalOpen =
      selectedService !== null ||
      consultingSpecialist !== null ||
      isGeneralBookingOpen ||
      isDatabaseVaultOpen;

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedService(null);
        setConsultingSpecialist(null);
        setIsGeneralBookingOpen(false);
        setIsDatabaseVaultOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedService, consultingSpecialist, isGeneralBookingOpen, isDatabaseVaultOpen]);

  // Programmatic scroll to sections with buttery smooth easing
  const handleScrollToServices = () => {
    const el = document.getElementById('services-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  const handleScrollToSpecialists = () => {
    const el = document.getElementById('specialists-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050B14] text-white flex flex-col items-center justify-center text-center selection:bg-[#D31E1E] selection:text-white">
      {/* Persistent Full-Page Wallpaper (Atmospheric, Rich & Darker) */}
      {websiteBackground ? (
        <div 
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
          style={{ contain: 'strict', willChange: 'transform' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${websiteBackground})`,
              filter: 'brightness(0.92) contrast(1.05) saturate(1.08)',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform',
            }}
          />
          {/* Balanced dark scrim so wallpaper is moody, darker, and luxury text pops */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />
        </div>
      ) : (
        <div 
          className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#081322] via-[#0E2038] to-[#081322]" 
          style={{ contain: 'strict' }}
        />
      )}

      {/* 1. Compulsory Section A: Handcrafted Hero Section (100vh) */}
      <HeroSection
        onConsultClick={handleScrollToSpecialists}
        onExploreServicesClick={handleScrollToServices}
        onBookClick={() => setIsGeneralBookingOpen(true)}
        websiteBackground={websiteBackground}
      />

      {/* 2. Compulsory Section B: Interactive Infinite Services Carousel */}
      <ServicesCarousel
        onSelectService={(service) => setSelectedService(service)}
        customImages={customServiceImages}
      />

      {/* 3. Compulsory Section C: Business Gallery (Interiors & Master Work) */}
      <BusinessGallery
        items={galleryItems}
        isLocked={isLocked}
        onUpdateGallery={(newItems) => setGalleryItems(newItems)}
        onSaveAndLock={handleSaveAndLockPermanently}
      />

      {/* 4. Compulsory Section D: Real Reviews Marquee */}
      <ReviewsMarquee />

      {/* 5. Compulsory Section E: Full-Screen "Meet Our Specialists" Showcase with Swipe Hand Gestures */}
      <SpecialistsShowcase
        onConsultSpecialist={(specialist) => setConsultingSpecialist(specialist)}
        specialistsBackground={specialistsBackground}
        isLocked={isLocked}
        onUploadBackground={(newBg) => setSpecialistsBackground(newBg)}
      />

      {/* 6. Compulsory Section F: Above-Footer Studio Timings & Location */}
      <LocationSection />

      {/* 7. Artisanal Studio Footer */}
      <StudioFooter
        onBookClick={() => setIsGeneralBookingOpen(true)}
        onExploreServicesClick={handleScrollToServices}
        onEditPhotosClick={() => setIsLocked(false)}
      />

      {/* Making Phase Studio Photo Manager */}
      {!isLocked && (
        <WebsitePhotoStudioDrawer
          isLocked={isLocked}
          servicesImages={customServiceImages}
          galleryItems={galleryItems}
          specialistsBackground={specialistsBackground}
          websiteBackground={websiteBackground}
          onUpdateServicesImages={(nextMap) => setCustomServiceImages(nextMap)}
          onUpdateGalleryItems={(nextItems) => setGalleryItems(nextItems)}
          onUpdateSpecialistsBackground={(newBg) => setSpecialistsBackground(newBg)}
          onUpdateWebsiteBackground={(newBg) => setWebsiteBackground(newBg)}
          onSaveAndLockPermanently={handleSaveAndLockPermanently}
          isSaving={isSavingLocked}
        />
      )}



      {/* Modals */}
      {/* Expanded 2x Service Modal (Permanent Photos, Read-Only with WhatsApp Routing) */}
      <ServiceModal
        service={selectedService}
        customImage={selectedService ? customServiceImages[selectedService.id] : undefined}
        onClose={() => setSelectedService(null)}
      />

      {/* Dedicated Specialist Consultation Modal */}
      <SpecialistConsultModal
        specialist={consultingSpecialist}
        onClose={() => setConsultingSpecialist(null)}
      />

      {/* General Studio Booking Modal */}
      <GeneralBookingModal
        isOpen={isGeneralBookingOpen}
        onClose={() => setIsGeneralBookingOpen(false)}
      />

      {/* Permanent Database Vault & Screenshot Archive Modal */}
      <DatabaseVaultModal
        isOpen={isDatabaseVaultOpen}
        onClose={() => setIsDatabaseVaultOpen(false)}
        screenshotUrl={screenshotUrl}
        screenshotTimestamp={screenshotTimestamp}
        onRetakeScreenshot={() => handleGenerateScreenshot(customServiceImages)}
        customRecords={customRecords}
        isGeneratingScreenshot={isGeneratingScreenshot}
      />
    </div>
  );
}
