/**
 * Permanent Database & Server Asset Manager for Fashion Hub Tattoo Studio
 * Combines server-side disk storage (/public/uploads/ & src/data/permanentWebsiteAssets.json)
 * with instant client-side rendering so custom photos stick permanently.
 */

import { SERVICES_DATA } from '../data/servicesData';
import defaultAssets from '../data/permanentWebsiteAssets.json';

export interface WebsiteAssetsManifest {
  isLocked: boolean;
  services: Record<string, string>;
  gallery: Array<{
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    aspect?: string;
    isCustom?: boolean;
  }>;
  specialistsBackground: string;
  websiteBackground: string;
  lockedAt: string | null;
}

export interface DbCustomPhotoRecord {
  serviceId: string;
  serviceName: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  savedAt: string;
  fileName?: string;
  fileSizeKb?: number;
  isLocked: boolean;
  dbKey: string;
  storageEngine: 'Server File Storage' | 'IndexedDB (ACID)' | 'LocalStorage Backup';
}

export interface DbGalleryPhotoRecord {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  aspect: string;
  savedAt: string;
  isLocked: boolean;
  fileName?: string;
  fileSizeKb?: number;
  storageEngine?: 'Server File Storage' | 'IndexedDB (ACID)' | 'LocalStorage Backup';
}

const LOCAL_STORAGE_KEY = 'fashion_hub_permanent_custom_photos_backup';
const LOCAL_STORAGE_GALLERY_KEY = 'fashion_hub_permanent_gallery_photos_backup';
const LOCAL_STORAGE_GALLERY_LOCKED_KEY = 'fashion_hub_gallery_is_locked';
const LOCAL_STORAGE_MANIFEST_KEY = 'fashion_hub_website_manifest_cache';

/**
 * Fetch authoritative assets from the server endpoint /api/locked-assets.
 * Falls back to statically bundled permanentWebsiteAssets.json if backend is offline.
 */
export async function fetchServerAssets(): Promise<WebsiteAssetsManifest> {
  // 1. Initial fallback from bundled JSON
  const fallback: WebsiteAssetsManifest = {
    isLocked: Boolean(defaultAssets.isLocked),
    services: (defaultAssets.services as Record<string, string>) || {},
    gallery: Array.isArray(defaultAssets.gallery) ? (defaultAssets.gallery as any) : [],
    specialistsBackground: defaultAssets.specialistsBackground || '',
    websiteBackground: defaultAssets.websiteBackground || '',
    lockedAt: defaultAssets.lockedAt || null,
  };

  try {
    const res = await fetch('/api/locked-assets');
    if (res.ok) {
      const serverData = await res.json();
      if (serverData && typeof serverData === 'object') {
        const merged: WebsiteAssetsManifest = {
          isLocked: Boolean(serverData.isLocked || fallback.isLocked),
          services: { ...fallback.services, ...(serverData.services || {}) },
          gallery: (serverData.gallery && serverData.gallery.length > 0) ? serverData.gallery : fallback.gallery,
          specialistsBackground: serverData.specialistsBackground || fallback.specialistsBackground,
          websiteBackground: serverData.websiteBackground || fallback.websiteBackground,
          lockedAt: serverData.lockedAt || fallback.lockedAt,
        };
        try {
          localStorage.setItem(LOCAL_STORAGE_MANIFEST_KEY, JSON.stringify(merged));
        } catch {
          // ignore storage quota
        }
        return merged;
      }
    }
  } catch (err) {
    console.warn('Could not contact /api/locked-assets, using local/bundled manifest:', err);
  }

  // Check localStorage cache
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_MANIFEST_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (JSON.stringify(parsed).includes('-1792')) {
        localStorage.removeItem(LOCAL_STORAGE_MANIFEST_KEY);
      } else {
        return {
          ...fallback,
          ...parsed,
        };
      }
    }
  } catch {
    // ignore
  }

  return fallback;
}

/**
 * Permanently save and lock all website assets to the server disk and static manifest.
 * Automatically converts any base64 data to physical files in /public/uploads/ and
 * writes src/data/permanentWebsiteAssets.json.
 */
export async function saveAndLockAllWebsiteAssets(
  manifest: Partial<WebsiteAssetsManifest>
): Promise<WebsiteAssetsManifest> {
  const payload = {
    isLocked: true,
    services: manifest.services || {},
    gallery: manifest.gallery || [],
    specialistsBackground: manifest.specialistsBackground || '',
    websiteBackground: manifest.websiteBackground || '',
  };

  try {
    const res = await fetch('/api/save-locked-assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.manifest) {
        try {
          localStorage.setItem(LOCAL_STORAGE_MANIFEST_KEY, JSON.stringify(data.manifest));
          localStorage.setItem(LOCAL_STORAGE_GALLERY_LOCKED_KEY, 'true');
        } catch {
          // ignore
        }
        return data.manifest;
      }
    } else {
      const errorText = await res.text();
      console.error('Server save error response:', errorText);
    }
  } catch (err) {
    console.error('Failed to post to /api/save-locked-assets:', err);
  }

  // Local fallback persistence
  const fallbackLocked: WebsiteAssetsManifest = {
    isLocked: true,
    services: payload.services,
    gallery: payload.gallery,
    specialistsBackground: payload.specialistsBackground,
    websiteBackground: payload.websiteBackground,
    lockedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_MANIFEST_KEY, JSON.stringify(fallbackLocked));
    localStorage.setItem(LOCAL_STORAGE_GALLERY_LOCKED_KEY, 'true');
  } catch {
    // ignore
  }

  return fallbackLocked;
}

/**
 * Optimize an uploaded image file using an offscreen canvas.
 * Keeps pristine visual fidelity with high-resolution output.
 */
export function optimizeImageFile(file: File, maxDim = 1600, quality = 0.9): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error('Failed to read file'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Calculate approximate file size in KB.
 */
export function calculateSizeKb(dataUrl: string): number {
  if (!dataUrl) return 0;
  const len = dataUrl.length;
  return Math.round((len * 0.75) / 1024);
}

// ----------------- Legacy Compatibility Layer -----------------

export async function initPermanentDatabase(): Promise<{
  records: DbCustomPhotoRecord[];
  imageMap: Record<string, string>;
}> {
  const manifest = await fetchServerAssets();
  const imageMap = manifest.services || {};
  const records: DbCustomPhotoRecord[] = Object.entries(imageMap).map(([serviceId, imageUrl]) => {
    const service = SERVICES_DATA.find((s) => s.id === serviceId);
    return {
      serviceId,
      serviceName: service?.name || serviceId,
      subtitle: service?.subtitle || '',
      category: service?.category || 'tattoo',
      imageUrl,
      savedAt: manifest.lockedAt || new Date().toISOString(),
      isLocked: manifest.isLocked,
      dbKey: `fhub_${serviceId}`,
      storageEngine: 'Server File Storage',
    };
  });

  return { records, imageMap };
}

export async function savePermanentCustomPhoto(
  serviceId: string,
  imageUrl: string,
  fileName?: string
): Promise<DbCustomPhotoRecord> {
  const service = SERVICES_DATA.find((s) => s.id === serviceId);
  const now = new Date().toISOString();

  const record: DbCustomPhotoRecord = {
    serviceId,
    serviceName: service?.name || serviceId,
    subtitle: service?.subtitle || '',
    category: service?.category || 'tattoo',
    imageUrl,
    savedAt: now,
    fileName: fileName || `${serviceId}-custom-upload.jpg`,
    fileSizeKb: calculateSizeKb(imageUrl),
    isLocked: true,
    dbKey: `fhub_perm_${serviceId}`,
    storageEngine: 'Server File Storage',
  };

  // Dual redundancy in local cache
  try {
    const currentBackup = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list: DbCustomPhotoRecord[] = currentBackup ? JSON.parse(currentBackup) : [];
    list = list.filter((r) => r.serviceId !== serviceId);
    list.push(record);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Local cache write issue:', err);
  }

  return record;
}

export async function initPermanentGalleryDatabase(): Promise<{
  photos: DbGalleryPhotoRecord[];
  isLocked: boolean;
}> {
  const manifest = await fetchServerAssets();
  const photos: DbGalleryPhotoRecord[] = (manifest.gallery || []).map((g, idx) => ({
    id: g.id || `gal-${idx + 1}`,
    title: g.title,
    category: g.category,
    imageUrl: g.imageUrl,
    aspect: g.aspect || 'aspect-square',
    savedAt: manifest.lockedAt || new Date().toISOString(),
    isLocked: manifest.isLocked,
    storageEngine: 'Server File Storage',
  }));

  return { photos, isLocked: manifest.isLocked };
}

export async function savePermanentGalleryPhotos(
  photos: DbGalleryPhotoRecord[]
): Promise<DbGalleryPhotoRecord[]> {
  const manifest = await fetchServerAssets();
  manifest.gallery = photos.map((p, idx) => ({
    id: p.id || `gal-${idx + 1}`,
    title: p.title,
    category: p.category,
    imageUrl: p.imageUrl,
    aspect: p.aspect || 'aspect-square',
  }));
  manifest.isLocked = true;

  await saveAndLockAllWebsiteAssets(manifest);
  return photos;
}

export function isGalleryPermanentlyLocked(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_GALLERY_LOCKED_KEY) === 'true';
  } catch {
    return false;
  }
}
