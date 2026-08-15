import { ReactNode } from "react";

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

export interface CartDrawerProps {
  state: AppState;
  onClose: () => void;
  onIncrease: (itemId: string) => void;
  onDecrease: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
}
export interface CheckoutPageProps {
  state: AppState;
  onBack: () => void;
  onComplete: () => void;
}

export interface FormErrors {
  [key: string]: string;
}
export interface OrderFlowPageProps {
  state: AppState;
  onSetActiveNav: (value: string) => void;
}
export interface MenuPageProps {
  state: AppState;
  onCategoryChange: (value: MenuCategory | 'All') => void;
  onDietaryChange: (value: DietaryTag | 'All') => void;
  onAddToCart: (itemId: string, quantity: number) => void;
}

export interface CorporateCateringPageProps {
  state: { quote: QuoteRequest };
  onChange: <K extends keyof QuoteRequest>(key: K, value: QuoteRequest[K]) => void;
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