import { ReactNode } from "react";
import { uiText } from "./content/common-content";

export type DietaryTag =
  | 'Vegetarian'
  | 'Vegan'
  | 'Gluten-Free'
  | 'Dairy-Free'
  | 'Nut Allergies'
  | 'Mild'
  | 'Medium'
  | 'Spicy';

export type MenuCategory =
  | 'Everyday Favorites'
  | 'Nepali Traditional'
  | 'Appetizers & Snacks'
  | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  portion: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  nutAllergyFriendly: boolean;
  spiceLevel: 'Mild' | 'Medium' | 'Spicy';
  allergens?: string[];
  image: string;
}

export interface CateringPackage {
  id: string;
  name: string;
  description: string;
  startingAt: number;
  badge: string;
}

export interface QuoteRequest {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  eventDate: string;
  numberOfPeople: number;
  deliveryAddress: string;
  mealType: string;
  budgetPerPerson: number;
  dietaryRequirements: string;
  notes: string;
}

export interface CartLine {
  id: string;
  quantity: number;
}

export interface AppState {
  selectedCategory: MenuCategory | 'All';
  selectedDietary: DietaryTag | 'All';
  cartCount: number;
  cartItems: CartLine[];
  quote: QuoteRequest;
  activeNav: string;
}
export type StoreUpdater<T extends object> = Partial<T> | ((current: T) => T);

export interface FormErrors {
  [key: string]: string;
}

export type ContentLabelGroup = {
  category: string;
  description: string;
  items: Array<{
    id: string;
    label: string;
  }>;
};

export type ContentLabelEntry = {
  id?: string;
  key?: string;
  label?: string;
  value?: string;
};

export type DatabaseLabelMap = Partial<Record<string, string>>;

export type ContentRegistryPayload =
  | DatabaseLabelMap
  | ContentLabelEntry[]
  | {
      labels?: DatabaseLabelMap | ContentLabelEntry[];
      data?: DatabaseLabelMap | ContentLabelEntry[];
      items?: ContentLabelEntry[];
      [key: string]: unknown;
    };

export interface ContentRegistryService {
  getLabels: () => Record<string, string>;
  getLabel: (id: string, fallback?: string) => string;
  getAll: () => Record<string, string>;
  hasLabel: (id: string) => boolean;
}
export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface CartDrawerMUIProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface GalleryItem {
  id: string;
  image: string;
  altKey: keyof typeof uiText.media;
  gridRow?: { sm: string };
  minHeight: { xs: number; sm: number } | number;
}

export type ContentEditorSaveMode = 'none' | 'callback' | 'reload';

export interface AdminContentEditorPageMUIProps {
  title?: string;
  subtitle?: string;
  contentEndpoint?: string;
  menuEndpoint?: string;
  saveMode?: ContentEditorSaveMode;
  onContentSaved?: (payload: { updates: Record<string, unknown>; result?: any }) => void;
  onMenuSaved?: (payload: { data: any; result?: any }) => void;
  onError?: (message: string) => void;
  showHeader?: boolean;
}