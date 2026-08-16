import { CateringPackage, MenuItem } from '../types';

/**
 * Default menu items - will be hydrated from backend at runtime
 * Source of truth: common/backend/utils/data/frontend-menu-data.js
 */
export let menuItems: MenuItem[] = [
  {
    id: 'momo-platter',
    name: 'Chicken Momo Platter',
    category: 'Appetizers & Snacks',
    description: 'Steamed dumplings served with homemade achar and red chili chutney.',
    price: 420,
    portion: '8 pcs',
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutAllergyFriendly: false,
    spiceLevel: 'Medium',
    allergens: ['Wheat', 'Soy'],
    image: 'https://images.unsplash.com/photo-1586511934875-5c5411eebf79?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'thakali-set',
    name: 'Thakali Set',
    category: 'Nepali Traditional',
    description: 'Classic Nepali platter with rice, dal, curry, pickles, and seasonal greens.',
    price: 620,
    portion: '1 serving',
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutAllergyFriendly: true,
    spiceLevel: 'Mild',
    allergens: ['Dairy'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'veg-chowmein',
    name: 'Vegetable Chowmein',
    category: 'Everyday Favorites',
    description: 'Wok-tossed noodles with vegetables and house seasoning.',
    price: 380,
    portion: '1 serving',
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    dairyFree: true,
    nutAllergyFriendly: true,
    spiceLevel: 'Medium',
    allergens: ['Wheat', 'Soy'],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'sekuwa-platter',
    name: 'Sekuwa Platter',
    category: 'Nepali Traditional',
    description: 'Grilled marinated meat skewers with crunchy salad and rice.',
    price: 760,
    portion: '2 servings',
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: true,
    nutAllergyFriendly: true,
    spiceLevel: 'Spicy',
    allergens: ['None major'],
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'kheer',
    name: 'Rice Kheer',
    category: 'Desserts',
    description: 'Slow-cooked rice pudding with cardamom and coconut.',
    price: 220,
    portion: '1 bowl',
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    nutAllergyFriendly: true,
    spiceLevel: 'Mild',
    allergens: ['Dairy'],
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'paneer-bhuna',
    name: 'Paneer Bhuna',
    category: 'Everyday Favorites',
    description: 'Rich, tomato-based paneer curry with warm Nepali spices.',
    price: 540,
    portion: '1 serving',
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    nutAllergyFriendly: true,
    spiceLevel: 'Medium',
    allergens: ['Dairy'],
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80',
  },
];

export const cateringPackages: CateringPackage[] = [
  {
    id: 'office-lunch',
    name: 'Basic Office Lunch',
    description: 'Balanced daily lunch boxes for teams and small offices.',
    startingAt: 650,
    badge: 'Best for teams',
  },
  {
    id: 'premium-office',
    name: 'Premium Office Lunch',
    description: 'Multi-course Nepali-inspired office catering with premium sides.',
    startingAt: 980,
    badge: 'Popular',
  },
  {
    id: 'nepali-experience',
    name: 'Nepali Experience',
    description: 'Buffet-style experience for meetings, events, and celebrations.',
    startingAt: 1800,
    badge: 'Event ready',
  },
];

/**
 * Hydrate menu data from backend
 * Fetches updated menu items and catering packages from the backend
 * Updates the exported values in this module
 */
export const hydrateMenuData = async () => {
  try {
    const authHeaders = (() => {
      const token = localStorage.getItem('authToken');
      if (token && token.startsWith('Bearer ')) {
        return { Authorization: token };
      }
      // Dev bypass
      const devHeaders: Record<string, string> = {
        'x-bypass-auth': 'true',
        'x-dev-user': JSON.stringify({
          id: 'dev-user',
          role: 'editor',
          entitlements: ['edit_content'],
        }),
      };
      return devHeaders;
    })();

    const response = await fetch('/api/pms_tms/v1/content/frontend-menu-data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    if (!response.ok) {
      console.warn('[MENU-DATA] Failed to hydrate menu data:', response.status);
      return;
    }

    const result = await response.json();
    if (result.success && result.data) {
      // Update exported values
      menuItems.length = 0;
      menuItems.push(...(result.data.menuItems || []));
      
      cateringPackages.length = 0;
      cateringPackages.push(...(result.data.cateringPackages || []));

      console.info('[MENU-DATA] Menu data hydrated successfully');
      
      // Dispatch event to notify components of update
      window.dispatchEvent(new CustomEvent('menu-data-updated', {
        detail: { menuItems, cateringPackages },
      }));
    }
  } catch (error) {
    console.error('[MENU-DATA] Hydration error:', error);
  }
};

/**
 * Initialize menu data on app startup
 * Prevents re-triggering hydration if already in progress
 */
let hydrateInProgress = false;
export const initializeMenuData = async () => {
  if (hydrateInProgress) {
    console.info('[MENU-DATA] Hydration already in progress, skipping');
    return;
  }
  
  hydrateInProgress = true;
  try {
    await hydrateMenuData();
  } finally {
    hydrateInProgress = false;
  }
};

