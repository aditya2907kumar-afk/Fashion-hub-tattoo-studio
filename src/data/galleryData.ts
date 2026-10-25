import { GalleryItem } from '../types';
import defaultAssets from './permanentWebsiteAssets.json';

const BASE_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Hospital-Grade Sterile Setup',
    category: 'Studio Architecture',
    imageUrl: '/uploads/gallery-1.jpg',
    aspect: 'aspect-square'
  },
  {
    id: 'gal-2',
    title: 'Hyper-Realism Sleeve Ink',
    category: 'Custom Tattoo',
    imageUrl: '/uploads/gallery-2.jpg',
    aspect: 'aspect-square'
  },
  {
    id: 'gal-3',
    title: 'Precision Ear Curation & Titanium',
    category: 'Body Piercing',
    imageUrl: '/uploads/gallery-3.jpg',
    aspect: 'aspect-square'
  },
  {
    id: 'gal-4',
    title: 'Dark Botanical Spine Script',
    category: 'Fine-Line Art',
    imageUrl: '/uploads/gallery-4.jpg',
    aspect: 'aspect-square'
  },
  {
    id: 'gal-5',
    title: 'Autoclave & Surgical Hygiene Station',
    category: 'Sterilization Protocols',
    imageUrl: '/uploads/gallery-5.jpg',
    aspect: 'aspect-square'
  },
  {
    id: 'gal-6',
    title: 'Polynesian Geometric Leg Piece',
    category: 'Tribal Masterwork',
    imageUrl: '/uploads/gallery-6.jpg',
    aspect: 'aspect-square'
  },
  {
    id: 'gal-7',
    title: 'Micro-Dermal Anchor Placement',
    category: 'Body Modification',
    imageUrl: '/uploads/gallery-7.jpg',
    aspect: 'aspect-square'
  },
  {
    id: 'gal-8',
    title: 'Botanical Floral Forearm Piece',
    category: 'Artisanal Ink',
    imageUrl: '/uploads/gallery-8.jpg',
    aspect: 'aspect-square'
  }
];

export const GALLERY_DATA: GalleryItem[] = BASE_GALLERY;
