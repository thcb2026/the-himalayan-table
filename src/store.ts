import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { AppState, QuoteRequest, MenuCategory, DietaryTag } from './types';

export const getInitialState = (): AppState => {
  if (typeof window === 'undefined') {
    return {
      selectedCategory: 'All',
      selectedDietary: 'All',
      cartCount: 0,
      cartItems: [],
      quote: {
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        eventDate: '',
        numberOfPeople: 0,
        deliveryAddress: '',
        mealType: '',
        budgetPerPerson: 500,
        dietaryRequirements: '',
        notes: '',
      },
      activeNav: 'Home',
    };
  }

  try {
    const saved = window.localStorage.getItem('the-himalayan-table-state');
    if (!saved) {
      return {
        selectedCategory: 'All',
        selectedDietary: 'All',
        cartCount: 0,
        cartItems: [],
        quote: {
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          eventDate: '',
          numberOfPeople: 0,
          deliveryAddress: '',
          mealType: '',
          budgetPerPerson: 500,
          dietaryRequirements: '',
          notes: '',
        },
        activeNav: 'Home',
      };
    }

    return JSON.parse(saved) as AppState;
  } catch {
    return {
      selectedCategory: 'All',
      selectedDietary: 'All',
      cartCount: 0,
      cartItems: [],
      quote: {
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        eventDate: '',
        numberOfPeople: 0,
        deliveryAddress: '',
        mealType: '',
        budgetPerPerson: 500,
        dietaryRequirements: '',
        notes: '',
      },
      activeNav: 'Home',
    };
  }
};

const initialState = getInitialState();

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<MenuCategory | 'All'>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedDietary: (state, action: PayloadAction<DietaryTag | 'All'>) => {
      state.selectedDietary = action.payload;
    },
    setActiveNav: (state, action: PayloadAction<string>) => {
      state.activeNav = action.payload;
    },
    addToCart: (state, action: PayloadAction<{ itemId: string; quantity?: number }>) => {
      const { itemId, quantity = 1 } = action.payload;
      const nextQuantity = Math.max(1, quantity);
      const existingItem = state.cartItems.find((item) => item.id === itemId);

      if (existingItem) {
        existingItem.quantity += nextQuantity;
      } else {
        state.cartItems.push({ id: itemId, quantity: nextQuantity });
      }

      state.cartCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },
    updateCartItem: (state, action: PayloadAction<{ itemId: string; delta: number }>) => {
      const { itemId, delta } = action.payload;
      const nextItems = state.cartItems
        .map((item) => item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
        .filter((item) => item.quantity > 0);

      state.cartItems = nextItems;
      state.cartCount = nextItems.reduce((sum, item) => sum + item.quantity, 0);
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
      state.cartCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },
    updateQuote: <K extends keyof QuoteRequest>(state: AppState, action: PayloadAction<{ key: K; value: QuoteRequest[K] }>) => {
      const { key, value } = action.payload;
      state.quote[key] = value as never;
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.cartCount = 0;
    },
    hydrateFromStorage: (state, action: PayloadAction<Partial<AppState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { 
  setSelectedCategory,
  setSelectedDietary,
  setActiveNav,
  addToCart,
  updateCartItem,
  removeCartItem,
  updateQuote,
  resetCart,
  hydrateFromStorage,
} = appSlice.actions;

export const appReducer = appSlice.reducer;

export const appStore = configureStore({
  reducer: {
    app: appReducer,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

export const selectAppState = (state: RootState) => state.app;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { appSlice };
