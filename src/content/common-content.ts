import type { QuoteRequest } from '../types';

export const navigation = ['Home', 'Menu', 'Order Online', 'Corporate Catering', 'Event Catering', 'Our Story', 'Contact'];
export const STORAGE_KEY = 'the-himalayan-table-state';
export const steps = ['Choose food', 'Pickup or Delivery', 'Date & Time', 'Confirm order'];
export const HOST_LOCAL_API_URL = 'http://localhost:5002';
export const API_BASE_PATH = '/api/pms_tms/v1';
export const DEFAULT_GET_CACHE_TTL_MS = 30 * 1000;
export const isAbsoluteUrl = (url: string): boolean => /^https?:\/\//i.test(url);
export const actionLabels = [
  {
    category: 'Navigation',
    description: 'App routes and navigation menu items',
    items: [
      { id: 'nav_home', label: 'Home' },
      { id: 'nav_menu', label: 'Menu' },
      { id: 'nav_corporate', label: 'Corporate Catering' },
      { id: 'nav_events', label: 'Event Catering' },
      { id: 'nav_story', label: 'Our Story' },
      { id: 'nav_contact', label: 'Contact' },
      { id: 'nav_order', label: 'Order Online' },
      { id: 'nav_checkout', label: 'Checkout' },
    ],
  },
  {
    category: 'Actions',
    description: 'Buttons and click triggers',
    items: [
      { id: 'act_menu', label: 'Menu' },
      { id: 'act_order_now', label: 'Order Now' },
      { id: 'act_explore_menu', label: 'Explore Menu' },
      { id: 'act_checkout', label: 'Checkout' },
      { id: 'act_go_checkout', label: 'Go to checkout' },
      { id: 'act_continue_shopping', label: 'Continue shopping' },
      { id: 'act_back', label: 'Back' },
      { id: 'act_back_home', label: 'Back to home' },
      { id: 'act_back_to_menu', label: 'Back to menu' },
      { id: 'act_continue', label: 'Continue' },
      { id: 'act_confirm_order', label: 'Confirm order' },
      { id: 'act_place_order', label: 'Place order' },
      { id: 'act_get_quote', label: 'Get a Quote' },
      { id: 'act_send_message', label: 'Send Message' },
      { id: 'act_add_to_cart', label: 'Add' },
    ],
  },
  {
    category: 'A11y & Metadata',
    description: 'Accessibility labels and static metadata',
    items: [
      { id: 'aria_shopping_cart', label: 'Shopping Cart' },
      { id: 'status_loading', label: 'Loading...' },
    ],
  },
];

export const appBrand = {
  name: 'The Himalayan Table',
  tagline: 'Authentic Nepali Catering & Events',
  shortDescription: 'Authentic Nepali flavors for office lunches and memorable events.',
  footerText: 'Authentic Nepali flavors for office lunches and memorable events.',
};

const contentRegistryTargets = {
  appBrand,
  uiText: undefined as any,
  contactInfo: undefined as any,
  currency: undefined as any,
};

export const applyRegistryOverrides = (registry: Record<string, string>) => {
  const targetMap: Record<string, Record<string, any>> = {
    appBrand,
    uiText: undefined as any,
    contactInfo: undefined as any,
    currency: undefined as any,
  };

  const rootTargets = {
    uiText,
    contactInfo,
    currency,
  };

  Object.assign(targetMap, rootTargets);

  Object.entries(registry).forEach(([key, value]) => {
    if (!key.includes('.')) return;

    const [rootKey, ...pathParts] = key.split('.');
    const target = targetMap[rootKey as keyof typeof targetMap];
    if (!target || pathParts.length === 0) return;

    let current: any = target;
    for (let index = 0; index < pathParts.length - 1; index += 1) {
      if (!current || typeof current !== 'object' || !(pathParts[index] in current)) {
        return;
      }
      current = current[pathParts[index]];
    }

    const finalKey = pathParts[pathParts.length - 1];
    if (!(current && typeof current === 'object' && finalKey in current)) {
      return;
    }

    const existingValue = current[finalKey];
    const parseArrayValue = (candidate: unknown): unknown[] | null => {
      if (Array.isArray(candidate)) {
        return candidate;
      }

      if (typeof candidate !== 'string') {
        return null;
      }

      try {
        const parsed = JSON.parse(candidate);
        return Array.isArray(parsed) ? parsed : null;
      } catch {
        return null;
      }
    };

    const candidateArray = parseArrayValue(value);
    if (Array.isArray(existingValue)) {
      if (candidateArray) {
        current[finalKey] = candidateArray;
      }
      return;
    }

    if (Array.isArray(candidateArray)) {
      current[finalKey] = candidateArray;
      return;
    }

    if (existingValue && typeof existingValue === 'object') {
      return;
    }

    current[finalKey] = value;
  });
};

export const errorBoundary = {
  title: 'Oops! Something went wrong',
  defaultError: 'An unexpected error occurred',
  supportMessage: 'Please try refreshing the page or contact support if the problem persists.',
  reloadButton: 'Reload Page',
  backHomeButton: 'Back to Home',
  backendNote:
    'If you\'re seeing this error repeatedly, the backend service may be unavailable. The app will work with local content, but shared content updates won\'t be available.',
};

export const uiText = {
  app: {
    menu: 'Menu',
    orderNow: 'Order Now',
    continueShopping: 'Continue shopping',
    goToCheckout: 'Go to checkout',
    backToHome: 'Back to home',
  },
  home: {
    welcome: 'Welcome to',
    title: 'The Himalayan Table',
    description:
      'Discover authentic Nepali cuisine crafted with traditional recipes and the finest ingredients. From office catering to unforgettable events, we bring the flavors of the Himalayas to your table.',
    exploreMenu: 'Explore Menu',
    orderOnline: 'Order Online',
    freeDelivery: 'Free Delivery',
    freeDeliveryDetail: 'Within 10 km radius',
    expertCatering: 'Expert Catering',
    expertCateringDetail: 'For all occasions',
    ourStory: 'Our Story',
    storyTitle: 'Bringing Nepal to Your Table',
    storyBodyOne:
      "For over a decade, we've been dedicated to sharing authentic Nepali flavors with the Kathmandu Valley. Every dish is prepared fresh using traditional techniques and the highest quality ingredients sourced directly from local suppliers.",
    storyBodyTwo:
      'Whether you\'re looking for a quick office lunch or planning a memorable celebration, we customize our offerings to suit your needs. Our team takes pride in delivering not just food, but an experience of Himalayan hospitality.',
  },
  menu: {
    title: 'Explore our authentic Nepali flavors',
    categoryLabel: 'Category',
    dietaryLabel: 'Dietary',
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    glutenFree: 'GF',
    add: 'Add',
    quantity: 'Quantity',
  },
  orderFlow: {
    eyebrow: 'Order Online',
    title: 'Simple ordering flow for pickup or delivery',
    backToMenu: 'Back to menu',
    stepChooseFood: '1. Choose your food',
    stepPickup: '2. Choose pickup or delivery',
    stepDateTime: '3. Choose date and time',
    stepPayment: 'Payment',
    selectedItem: 'Selected item',
    orderSummary: 'Order summary',
    continue: 'Continue',
    confirmOrder: 'Confirm order',
    pickup: 'Pickup',
    deliveryLabel: 'Delivery',
    deliveryAddress: 'Delivery address',
    addressPlaceholder: 'Enter household or office address',
    subtotal: 'Subtotal',
    total: 'Total',
    preferredDate: 'Preferred date',
    preferredTime: 'Preferred time',
    paymentMethod: 'Payment method',
    orderConfirmed: 'Order confirmed',
    thankYou: 'Thank you for your order.',
    orderScheduled: 'Your {itemName} order for {quantity} item(s) has been scheduled. A confirmation will be sent to your email and phone.',
    backToHome: 'Back to home',
    paymentOptions: ['Esewa', 'IME Pay', 'Cash on Delivery'],
    quantityLabel: 'Quantity',
    paymentOptionsLabel: 'Payment',
    deliveryModePickup: 'Pickup',
    deliveryModeDelivery: 'Delivery',
    orderConfirmedMessage: 'Order confirmed',
    totalAmount: 'Total amount',
  },
  cart: {
    title: 'Cart',
    empty: 'Your cart is empty.',
    subtotal: 'Subtotal',
    checkout: 'Go to checkout',
  },
  checkout: {
    eyebrow: 'Checkout',
    title: 'Review your order and complete payment',
    back: 'Back',
    customerDetails: 'Customer details',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    deliveryAddress: 'Delivery Address',
    notes: 'Notes (optional)',
    orderSummary: 'Order summary',
    paymentMethod: 'Payment method',
    placeOrder: 'Place order',
    sentTitle: 'Thank you for your order!',
    sentMessage: 'We\'ve received your order and will confirm via email and SMS shortly.',
    customerLabel: 'Customer',
    deliveryTo: 'Delivery to',
    totalAmount: 'Total amount',
    backToHome: 'Back to home',
    orderPlaced: 'Order placed',
  },
  contact: {
    eyebrow: 'Contact Us',
    title: 'Get in touch with The Himalayan Table',
    sendMessage: 'Send us a message',
    yourName: 'Your Name',
    yourEmail: 'Email',
    subject: 'Subject',
    message: 'Message',
    sendButton: 'Send Message',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    location: 'Location',
    quickContact: 'Quick contact',
    whatsapp: 'WhatsApp',
    viber: 'Viber',
    instagram: 'Instagram',
    facebook: 'Facebook',
  },
  corporate: {
    eyebrow: 'Corporate Catering',
    title: 'Get a customized quote for your event',
    submit: 'Get a Quote',
    companyName: 'Company Name',
    contactPerson: 'Contact Person',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    eventDate: 'Event Date',
    numberOfPeople: 'Number of People',
    deliveryAddress: 'Delivery Address',
    mealType: 'Meal Type',
    budgetPerPerson: 'Budget per Person',
    dietaryRequirements: 'Dietary Requirements & Special Notes',
    costEstimate: 'Cost Estimate',
    featureTitle: 'Why Choose The Himalayan Table?',
    features: [
      'Authentic mountain spices & recipes',
      'Freshly sourced organic ingredients',
      'Customizable corporate menu options',
      'Punctual delivery & professional setup',
    ],
    successMessage: 'Thank you for your interest! We\'ll contact you within 24 hours.',
    guestsPrefix: 'guests × NRs',
  },
  footer: {
    contactPhone: 'Phone: +977-9800000000',
    contactEmail: 'Email: hello@thehimalayantable.com',
    socials: ['WhatsApp / Viber', 'Instagram / Facebook'],
  },
  accessibility: {
    menuFilters: 'Menu filters',
    menuItems: 'Menu items',
    checkoutForm: 'Checkout form',
    contactForm: 'Contact form',
    contactDetails: 'Contact details',
    orderProgressSteps: 'Order progress steps',
    selectedItemSummary: 'Selected item summary',
    orderSummaryPickup: 'Order summary for pickup options',
    paymentSelection: 'Payment selection panel',
    choosePaymentMethod: 'Choose payment method',
    orderSummaryPanel: 'Order summary panel',
    selectItem: (itemName: string) => `Select ${itemName}`,
    callPhone: (phone: string) => `Call ${phone}`,
    emailAddress: (email: string) => `Email ${email}`,
    decreaseQuantity: (itemName: string) => `Decrease quantity for ${itemName}`,
    increaseQuantity: (itemName: string) => `Increase quantity for ${itemName}`,
  },
  media: {
    nepaliFood: 'Nepali Food',
    spices: 'Spices',
    eventCatering: 'Event Catering',
  },
};

export const currency = {
  symbol: 'NRs',
};

export const contactInfo = {
  phone: '+977-9800000000',
  email: 'hello@thehimalayantable.com',
  location: 'Kathmandu Valley, Nepal',
  instagram: '@thehimalayantable',
  facebook: 'The Himalayan Table',
};

export const initialQuote: QuoteRequest = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  eventDate: '',
  numberOfPeople: 25,
  deliveryAddress: '',
  mealType: 'Office Lunch',
  budgetPerPerson: 850,
  dietaryRequirements: '',
  notes: '',
};

contentRegistryTargets.uiText = uiText;
contentRegistryTargets.contactInfo = contactInfo;
contentRegistryTargets.currency = currency;

export const menuCategories = ['All', 'Everyday Favorites', 'Nepali Traditional', 'Appetizers & Snacks', 'Desserts'];
export const dietaryOptions = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut Allergies'];

export const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  deliveryAddress: '',
  notes: '',
  paymentMethod: 'Esewa',
};

export const validationMessages = {
  checkout: {
    firstName: 'First name is required',
    lastName: 'Last name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email address',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'Invalid phone number',
    deliveryAddress: 'Delivery address is required',
  },
  corporate: {
    companyName: 'Company name is required',
    contactPerson: 'Contact person is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email',
    phone: 'Phone is required',
    eventDate: 'Event date is required',
    numberOfPeople: 'Minimum 10 people required',
    deliveryAddress: 'Delivery address is required',
    mealType: 'Meal type is required',
  },
};