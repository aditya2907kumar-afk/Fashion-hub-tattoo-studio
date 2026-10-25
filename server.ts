import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Generous limit for high-resolution images
  app.use(express.json({ limit: '60mb' }));
  app.use(express.urlencoded({ extended: true, limit: '60mb' }));

  const publicDir = path.resolve(__dirname, 'public');
  const uploadsDir = path.resolve(publicDir, 'uploads');
  const srcDataDir = path.resolve(__dirname, 'src', 'data');
  const manifestPath = path.resolve(srcDataDir, 'permanentWebsiteAssets.json');

  // Ensure directories exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(srcDataDir)) {
    fs.mkdirSync(srcDataDir, { recursive: true });
  }

  // Ensure manifest exists
  if (!fs.existsSync(manifestPath)) {
    fs.writeFileSync(
      manifestPath,
      JSON.stringify(
        {
          isLocked: false,
          services: {},
          gallery: [],
          specialistsBackground: '',
          websiteBackground: '',
          lockedAt: null,
        },
        null,
        2
      )
    );
  }

  // Static serving for uploaded assets directly
  app.use('/uploads', express.static(uploadsDir));
  app.use(express.static(publicDir));

  // Helper to persist base64 data to disk
  const saveBase64ToDisk = (base64Str: string, prefix: string): string => {
    if (!base64Str || !base64Str.startsWith('data:image/')) {
      return base64Str;
    }

    try {
      const match = base64Str.match(/^data:image\/(\w+);base64,/);
      let ext = match ? match[1] : 'jpg';
      if (ext === 'jpeg') ext = 'jpg';
      const cleanData = base64Str.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(cleanData, 'base64');
      const canonicalName = `${prefix}.${ext}`;
      const destPath = path.join(uploadsDir, canonicalName);
      fs.writeFileSync(destPath, buffer);
      return `/uploads/${canonicalName}`;
    } catch (err) {
      console.error('Failed to save base64 image to disk:', err);
      return base64Str;
    }
  };

  // API: Get current permanent assets
  app.get('/api/locked-assets', (_req, res) => {
    try {
      if (fs.existsSync(manifestPath)) {
        const raw = fs.readFileSync(manifestPath, 'utf-8');
        res.json(JSON.parse(raw));
      } else {
        res.json({
          isLocked: false,
          services: {},
          gallery: [],
          specialistsBackground: '',
          websiteBackground: '',
          lockedAt: null,
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: Upload individual photo to server disk
  app.post('/api/upload-photo', (req, res) => {
    try {
      const { base64Data, prefix = 'custom-asset' } = req.body;
      if (!base64Data) {
        return res.status(400).json({ error: 'No image data provided' });
      }

      const fileUrl = saveBase64ToDisk(base64Data, prefix);
      res.json({ success: true, url: fileUrl });
    } catch (err: any) {
      console.error('API upload error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // API: Save and permanently lock all website assets
  app.post('/api/save-locked-assets', (req, res) => {
    try {
      const {
        isLocked = true,
        services = {},
        gallery = [],
        specialistsBackground = '',
        websiteBackground = '',
      } = req.body;

      // Persist any services images that are base64
      const finalServices: Record<string, string> = {};
      for (const [key, val] of Object.entries(services)) {
        if (typeof val === 'string') {
          finalServices[key] = saveBase64ToDisk(val, `service-${key}`);
        }
      }

      // Persist any gallery images that are base64
      const finalGallery = Array.isArray(gallery)
        ? gallery.map((item: any, idx: number) => ({
            id: item.id || `gal-${idx + 1}`,
            title: item.title || `Masterpiece #${idx + 1}`,
            category: item.category || 'Studio Craft',
            aspect: item.aspect || 'aspect-square',
            imageUrl: saveBase64ToDisk(item.imageUrl, `gallery-${idx + 1}`),
          }))
        : [];

      // Persist backgrounds
      const finalSpecialistsBg = specialistsBackground
        ? saveBase64ToDisk(specialistsBackground, 'specialists-bg')
        : '';
      const finalWebsiteBg = websiteBackground
        ? saveBase64ToDisk(websiteBackground, 'website-bg')
        : '';

      const manifestData = {
        isLocked: Boolean(isLocked),
        services: finalServices,
        gallery: finalGallery,
        specialistsBackground: finalSpecialistsBg,
        websiteBackground: finalWebsiteBg,
        lockedAt: isLocked ? new Date().toISOString() : null,
      };

      fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf-8');
      console.log('Successfully saved and locked website assets to disk.');

      res.json({ success: true, manifest: manifestData });
    } catch (err: any) {
      console.error('API save locked assets error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // API: Unlock for editing (if requested)
  app.post('/api/unlock-website', (_req, res) => {
    try {
      let currentData: any = {};
      if (fs.existsSync(manifestPath)) {
        currentData = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      }
      currentData.isLocked = false;
      fs.writeFileSync(manifestPath, JSON.stringify(currentData, null, 2), 'utf-8');
      res.json({ success: true, manifest: currentData });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mount Vite middleware in development or serve static build in production
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Fashion Hub Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
