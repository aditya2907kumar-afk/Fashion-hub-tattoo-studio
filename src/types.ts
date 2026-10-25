export interface ServiceItem {
  id: string;
  name: string;
  subtitle: string;
  category: 'tattoo' | 'piercing' | 'specialized';
  avgTime: string;
  description: string;
  sessionSteps: {
    number: string;
    title: string;
    detail: string;
  }[];
  accent: string;
  imageUrl: string;
}

export interface Specialist {
  id: string;
  name: string;
  shortName: string;
  role: string;
  phone: string;
  phoneFormatted: string;
  secondaryPhone?: string;
  secondaryPhoneFormatted?: string;
  experience: string;
  milestone: string;
  story: string;
  specialties: string[];
  avatarUrl: string;
}

export interface ReviewItem {
  id: string;
  stars: number;
  quote: string;
  author: string;
  highlight: string;
  date?: string;
  badge?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  aspect: string;
  isCustom?: boolean;
}

export type PreferredTime = 'Today' | 'Tomorrow' | 'This Weekend' | 'Next Week' | 'Not Specific Time';
