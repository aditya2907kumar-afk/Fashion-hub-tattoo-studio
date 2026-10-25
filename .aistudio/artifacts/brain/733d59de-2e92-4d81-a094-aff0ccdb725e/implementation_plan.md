# Plan: Permanent Direct Code Embedding for Custom Photos [COMPLETED]

Lock all 24 custom uploaded studio photos directly into the TypeScript source code and canonical asset storage with fixed, permanent paths so photos never disappear or revert on future edits.

## Status: Executed & Verified

1. **24 Canonical Photos Established**:
   - `/uploads/service-custom-tattoo-design.jpg` through all 15 services.
   - `/uploads/gallery-1.jpg` through `/uploads/gallery-8.jpg`.
   - `/uploads/website-bg.jpg`.
2. **Direct Code Embedding**:
   - `src/data/servicesData.ts`: Every single service has its canonical path hard-coded directly into `BASE_SERVICES_DATA`.
   - `src/data/galleryData.ts`: Every gallery item has its canonical path hard-coded directly into `BASE_GALLERY`.
   - `src/data/permanentWebsiteAssets.json`: All entries mapped to permanent canonical paths with `"isLocked": true`.
   - `src/App.tsx`: Wallpaper mapped to `/uploads/website-bg.jpg`.
3. **Deterministic Upload Naming**:
   - `server.ts` updated so any future uploads write directly to canonical filenames, preventing hash/timestamp drift.
4. **Build Verification**:
   - `lint_applet` and `compile_applet` passed with zero errors.
   - Dev server restarted cleanly.
