/**
 * Static configuration datasets and preset values for the 3-step Event Wizard.
 */

export const EVENT_TYPES = [
  { id: 'Wedding', label: 'Wedding', icon: '💍', desc: 'Ceremony & reception' },
  { id: 'Birthday', label: 'Birthday', icon: '🎂', desc: 'Milestone & party' },
  { id: 'Anniversary', label: 'Anniversary', icon: '🥂', desc: 'Love & celebration' },
  { id: 'Community Event', label: 'Community Event', icon: '🎪', desc: 'Festival & gathering' },
  { id: 'Corporate', label: 'Corporate Gala', icon: '💼', desc: 'Conference & dinner' },
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
];

export const LOCATION_TYPES = [
  { id: 'Indoor', label: 'Indoor Hall', desc: 'Banquet hall or ballroom' },
  { id: 'Outdoor', label: 'Outdoor Garden', desc: 'Lawn, beach, or vineyard' },
  { id: 'Hybrid', label: 'Hybrid Space', desc: 'Indoor dining + outdoor patio' },
];

export const DESIRED_EXPERIENCES = [
  { id: 'Intimate & Heartfelt', label: 'Intimate & Heartfelt', desc: 'Close warmth & emotional connection' },
  { id: 'High-Energy & Vibrant', label: 'High-Energy & Vibrant', desc: 'Party vibe & nonstop dance floor' },
  { id: 'Luxury & Prestigious', label: 'Luxury & Formal', desc: 'Black-tie elegance & elite gastronomy' },
  { id: 'Casual & Festive', label: 'Casual & Festive', desc: 'Relaxed mingling & effortless hospitality' },
  { id: 'Artistic & Bohemian', label: 'Artistic & Bohemian', desc: 'Creative flair & eclectic styling' },
];

export const MUST_HAVES_OPTIONS = [
  'Professional Photography',
  'Open Bar & Signature Mixology',
  'Live Band or High-Energy DJ',
  'Drone Videography',
  'Interactive Photo Booth',
  'Multi-Tier Custom Cake',
  'Late-Night Gourmet Snack Station',
];

export const ACCESSIBILITY_OPTIONS = [
  'Wheelchair / Step-Free Access',
  'Vegan & Celiac-Friendly Catering',
  'Quiet Sensory / Decompression Zone',
  'Elderly-Friendly Ergonomic Seating',
  'Halal / Kosher Certified Kitchen',
];

export const CULTURAL_PREFERENCES_OPTIONS = [
  'Traditional Ceremonial Rituals',
  'Bilingual MC / Announcements',
  'Multi-Faith Inclusivity',
  'Custom Heritage Decor Accents',
  'Traditional Music & Dance Welcome',
];

export const THEME_PRESETS = [
  'Royal Elegance & Warm Glow',
  'Rustic Botanical & Fairy Lights',
  'Sunset Bohemian Radiance',
  'Modern Monochrome Chic',
  'Retro Glamour & Velvet',
];

export const INITIAL_FORM_DATA = {
  eventType: 'Wedding',
  targetDate: '',
  guestCount: 75,
  budget: 8000,
  currency: 'USD',
  locationType: 'Indoor',
  desiredExperience: 'Intimate & Heartfelt',
  theme: 'Royal Elegance & Warm Glow',
  mustHaves: ['Professional Photography', 'Interactive Photo Booth'],
  accessibility: ['Wheelchair / Step-Free Access'],
  culturalPreferences: ['Traditional Ceremonial Rituals'],
  notes: '',
};
