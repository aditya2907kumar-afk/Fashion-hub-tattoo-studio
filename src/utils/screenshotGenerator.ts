/**
 * Screenshot & Picture Generator for Fashion Hub Tattoo Studio
 * Captures all 15 service images into a master high-resolution branded screenshot/picture collage.
 */

import { SERVICES_DATA } from '../data/servicesData';

interface GenerateScreenshotOptions {
  customImages: Record<string, string>;
  title?: string;
}

export interface ScreenshotResult {
  dataUrl: string;
  blob: Blob | null;
  timestamp: string;
  count: number;
}

export async function generateServicesMasterScreenshot({
  customImages,
  title = 'FASHION HUB TATTOO STUDIO — MASTER SERVICES VAULT',
}: GenerateScreenshotOptions): Promise<ScreenshotResult> {
  const timestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Master Canvas Dimensions
  // 5 columns x 3 rows = 15 services
  const cols = 5;
  const rows = 3;
  const cardWidth = 360;
  const cardHeight = 440;
  const paddingX = 60;
  const paddingTop = 220;
  const paddingBottom = 120;
  const gap = 30;

  const canvasWidth = paddingX * 2 + cols * cardWidth + (cols - 1) * gap;
  const canvasHeight = paddingTop + rows * cardHeight + (rows - 1) * gap + paddingBottom;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context is not available');
  }

  // 1. Draw Deep Obsidian & Dark Botanical Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  bgGrad.addColorStop(0, '#050B14');
  bgGrad.addColorStop(0.5, '#091726');
  bgGrad.addColorStop(1, '#050B14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Outer framing border with crimson accents
  ctx.strokeStyle = 'rgba(211, 30, 30, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);

  // Corner markers
  const cornerSize = 24;
  ctx.strokeStyle = '#D31E1E';
  ctx.lineWidth = 4;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(20, 20 + cornerSize);
  ctx.lineTo(20, 20);
  ctx.lineTo(20 + cornerSize, 20);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(canvasWidth - 20 - cornerSize, 20);
  ctx.lineTo(canvasWidth - 20, 20);
  ctx.lineTo(canvasWidth - 20, 20 + cornerSize);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(20, canvasHeight - 20 - cornerSize);
  ctx.lineTo(20, canvasHeight - 20);
  ctx.lineTo(20 + cornerSize, canvasHeight - 20);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(canvasWidth - 20 - cornerSize, canvasHeight - 20);
  ctx.lineTo(canvasWidth - 20, canvasHeight - 20);
  ctx.lineTo(canvasWidth - 20, canvasHeight - 20 - cornerSize);
  ctx.stroke();

  // 2. Master Header
  ctx.fillStyle = '#D31E1E';
  ctx.font = 'bold 18px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('EST. 2018 ▪ KANKARBAGH, PATNA, BIHAR ▪ 4.9★ RATED', canvasWidth / 2, 70);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
  ctx.fillText(title, canvasWidth / 2, 125);

  ctx.fillStyle = '#A3B8CC';
  ctx.font = '18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    `Permanent Database Master Screenshot Snapshot ▪ Captured: ${timestamp} ▪ 15 Verified Services`,
    canvasWidth / 2,
    165
  );

  // Horizontal divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(paddingX, 190);
  ctx.lineTo(canvasWidth - paddingX, 190);
  ctx.stroke();

  // Helper to load image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });
  };

  // 3. Render each service card into grid
  for (let i = 0; i < SERVICES_DATA.length; i++) {
    const service = SERVICES_DATA[i];
    const c = i % cols;
    const r = Math.floor(i / cols);

    const x = paddingX + c * (cardWidth + gap);
    const y = paddingTop + r * (cardHeight + gap);

    // Card background
    ctx.fillStyle = '#091726';
    roundRect(ctx, x, y, cardWidth, cardHeight, 16);
    ctx.fill();

    // Card border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, cardWidth, cardHeight, 16);
    ctx.stroke();

    const imageUrl = customImages[service.id] || service.imageUrl;

    // Try drawing image
    let imageDrawn = false;
    try {
      const img = await loadImage(imageUrl);
      ctx.save();
      roundRect(ctx, x, y, cardWidth, cardHeight - 110, 16);
      ctx.clip();

      // Draw cover crop
      const imgAspect = img.width / img.height;
      const targetAspect = cardWidth / (cardHeight - 110);
      let sx = 0, sy = 0, sw = img.width, sh = img.height;

      if (imgAspect > targetAspect) {
        sw = img.height * targetAspect;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / targetAspect;
        sy = (img.height - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, x, y, cardWidth, cardHeight - 110);

      // Dark gradient overlay on photo
      const cardGrad = ctx.createLinearGradient(x, y + cardHeight - 200, x, y + cardHeight - 110);
      cardGrad.addColorStop(0, 'rgba(9, 23, 38, 0)');
      cardGrad.addColorStop(1, 'rgba(9, 23, 38, 0.95)');
      ctx.fillStyle = cardGrad;
      ctx.fillRect(x, y + cardHeight - 200, cardWidth, 90);

      ctx.restore();
      imageDrawn = true;
    } catch {
      // Fallback stylized dark banner
      ctx.fillStyle = '#0D2137';
      ctx.fillRect(x, y, cardWidth, cardHeight - 110);
    }

    // Top Category / Subtitle Pill
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    roundRect(ctx, x + 16, y + 16, cardWidth - 32, 28, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    roundRect(ctx, x + 16, y + 16, cardWidth - 32, 28, 14);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(service.subtitle.toUpperCase(), x + cardWidth / 2, y + 34);

    // Card Footer Details
    const footerY = y + cardHeight - 95;

    // Service Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    const cleanName = service.name.length > 28 ? service.name.slice(0, 26) + '...' : service.name;
    ctx.fillText(cleanName, x + cardWidth / 2, footerY);

    // Database Status Tag
    ctx.fillStyle = '#D31E1E';
    ctx.font = 'bold 10px "Cinzel", Georgia, serif';
    ctx.fillText(`[DATABASE RECORD: #0${i + 1} ▪ LOCKED]`, x + cardWidth / 2, footerY + 36);

    if (!imageDrawn) {
      ctx.fillStyle = '#A3B8CC';
      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('[Representative Art]', x + cardWidth / 2, y + 150);
    }
  }

  // 4. Master Footer
  const footerBaseY = canvasHeight - 50;
  ctx.fillStyle = '#A3B8CC';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'FASHION HUB TATTOO STUDIO ▪ BANKMAN COLONY, KANKARBAGH, PATNA ▪ WHATSAPP: +91 93340 57159',
    canvasWidth / 2,
    footerBaseY - 20
  );
  ctx.fillStyle = '#D31E1E';
  ctx.font = 'bold 12px "Cinzel", Georgia, serif';
  ctx.fillText(
    'AUTHENTIC DATABASE VAULT SNAPSHOT ▪ HOSPITAL GRADE STERILIZATION ▪ ALL RIGHTS RESERVED',
    canvasWidth / 2,
    footerBaseY + 5
  );

  // 5. Export to Data URL and Blob
  const dataUrl = canvas.toDataURL('image/png', 0.95);

  const blob: Blob | null = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/png', 0.95);
  });

  return {
    dataUrl,
    blob,
    timestamp,
    count: SERVICES_DATA.length,
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}
