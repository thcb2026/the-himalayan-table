import type { GalleryItem, QuoteRequest } from '../types';

export const navigation = ['Home', 'Menu', 'Order Online', 'Corporate Catering', 'Event Catering', 'Our Story', 'Contact'];
export const STORAGE_KEY = 'the-himalayan-table-state';
export const steps = ['Choose food', 'Pickup or Delivery', 'Date & Time', 'Confirm order'];
export const HOST_LOCAL_API_URL = 'http://localhost:5002';
export const API_BASE_PATH = '/api/pms_tms/v1';
export const DEFAULT_GET_CACHE_TTL_MS = 30 * 1000;
export const isAbsoluteUrl = (url: string): boolean => /^https?:\/\//i.test(url);

const isObjectLike = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const deepMergeContent = (target: Record<string, any>, source: Record<string, any>): Record<string, any> => {
  if (!isObjectLike(source)) {
    return target;
  }

  Object.entries(source).forEach(([key, value]) => {
    const currentValue = target[key];

    if (isObjectLike(currentValue) && isObjectLike(value)) {
      deepMergeContent(currentValue, value);
      return;
    }

    target[key] = value;
  });

  return target;
};

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

let isFrontendContentHydrating = false;

export const hydrateFrontendContent = async (): Promise<void> => {
  if (typeof window === 'undefined' || isFrontendContentHydrating) {
    return;
  }

  isFrontendContentHydrating = true;

  try {
    const response = await fetch(`${HOST_LOCAL_API_URL}/api/pms_tms/v1/content/frontend-common-content`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const data = payload?.data ?? payload;
    if (!data || typeof data !== 'object') {
      return;
    }

    if (Array.isArray(data.actionLabels)) {
      actionLabels.splice(0, actionLabels.length, ...data.actionLabels);
    }

    if (Array.isArray(data.navigation)) {
      navigation.splice(0, navigation.length, ...data.navigation);
    }

    if (Array.isArray(data.menuCategories)) {
      menuCategories.splice(0, menuCategories.length, ...data.menuCategories);
    }

    if (Array.isArray(data.dietaryOptions)) {
      dietaryOptions.splice(0, dietaryOptions.length, ...data.dietaryOptions);
    }

    if (Array.isArray(data.steps)) {
      steps.splice(0, steps.length, ...data.steps);
    }

    if (data.appBrand && typeof data.appBrand === 'object') {
      deepMergeContent(appBrand, data.appBrand);
    }

    if (data.uiText && typeof data.uiText === 'object') {
      deepMergeContent(uiText, data.uiText);
    }

    if (data.contactInfo && typeof data.contactInfo === 'object') {
      deepMergeContent(contactInfo, data.contactInfo);
    }

    if (data.currency && typeof data.currency === 'object') {
      deepMergeContent(currency, data.currency);
    }

    if (data.validationMessages && typeof data.validationMessages === 'object') {
      deepMergeContent(validationMessages, data.validationMessages);
    }
  } catch (error) {
    console.warn('[common-content] Failed to hydrate frontend content from API:', error);
  } finally {
    isFrontendContentHydrating = false;
  }
};

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

export const pageGroups = [
  {
    title: 'Header / App Shell',
    fields: [
      { path: 'appBrand.name', label: 'Header brand name' },
      { path: 'appBrand.tagline', label: 'Header tagline' },
      { path: 'currency.symbol', label: 'Currency symbol' },
    ],
  },
  {
    title: 'HomePageMUI',
    fields: [
      { path: 'uiText.home.welcome', label: 'Home welcome label' },
      { path: 'uiText.home.title', label: 'Hero title' },
      { path: 'uiText.home.description', label: 'Hero description', multiline: true },
      { path: 'uiText.home.exploreMenu', label: 'Explore menu button label' },
      { path: 'uiText.home.orderOnline', label: 'Order now button label' },
      { path: 'uiText.home.freeDelivery', label: 'Free delivery label' },
      { path: 'uiText.home.freeDeliveryDetail', label: 'Free delivery detail' },
      { path: 'uiText.home.expertCatering', label: 'Expert catering label' },
      { path: 'uiText.home.expertCateringDetail', label: 'Expert catering detail' },
      { path: 'uiText.home.ourStory', label: 'Our story heading label' },
      { path: 'uiText.home.storyTitle', label: 'Story section title' },
      { path: 'uiText.home.storyBodyOne', label: 'Story paragraph 1', multiline: true },
      { path: 'uiText.home.storyBodyTwo', label: 'Story paragraph 2', multiline: true },
    ],
  },
  {
    title: 'MenuPageMUI',
    fields: [
      { path: 'uiText.app.menu', label: 'Menu breadcrumb / section label' },
      { path: 'uiText.menu.title', label: 'Menu page title' },
      { path: 'uiText.menu.categoryLabel', label: 'Category filter label' },
      { path: 'uiText.menu.dietaryLabel', label: 'Dietary filter label' },
      { path: 'uiText.menu.vegetarian', label: 'Vegetarian tag' },
      { path: 'uiText.menu.vegan', label: 'Vegan tag' },
      { path: 'uiText.menu.glutenFree', label: 'Gluten-free tag' },
      { path: 'uiText.menu.add', label: 'Add to cart label' },
    ],
  },
  {
    title: 'OrderFlowPageMUI',
    fields: [
      { path: 'uiText.orderFlow.eyebrow', label: 'Order flow eyebrow' },
      { path: 'uiText.orderFlow.title', label: 'Order flow title' },
      { path: 'uiText.orderFlow.backToMenu', label: 'Back to menu button' },
      { path: 'uiText.orderFlow.stepChooseFood', label: 'Choose food step label' },
      { path: 'uiText.orderFlow.selectedItem', label: 'Selected item label' },
      { path: 'uiText.orderFlow.quantityLabel', label: 'Quantity label' },
      { path: 'uiText.orderFlow.continue', label: 'Continue button label' },
      { path: 'uiText.orderFlow.stepPickup', label: 'Pickup step label' },
      { path: 'uiText.orderFlow.paymentMethod', label: 'Payment method heading' },
      { path: 'uiText.orderFlow.deliveryModePickup', label: 'Pickup option label' },
      { path: 'uiText.orderFlow.deliveryModeDelivery', label: 'Delivery option label' },
      { path: 'uiText.orderFlow.deliveryAddress', label: 'Delivery address label' },
      { path: 'uiText.orderFlow.addressPlaceholder', label: 'Delivery address placeholder' },
      { path: 'uiText.orderFlow.orderSummary', label: 'Order summary label' },
      { path: 'uiText.orderFlow.subtotal', label: 'Subtotal label' },
      { path: 'uiText.orderFlow.deliveryLabel', label: 'Delivery label' },
      { path: 'uiText.orderFlow.total', label: 'Total label' },
      { path: 'uiText.orderFlow.stepDateTime', label: 'Date/time step label' },
      { path: 'uiText.orderFlow.preferredDate', label: 'Preferred date label' },
      { path: 'uiText.orderFlow.preferredTime', label: 'Preferred time label' },
      { path: 'uiText.orderFlow.stepPayment', label: 'Payment step label' },
      { path: 'uiText.orderFlow.confirmOrder', label: 'Confirm order button label' },
      { path: 'uiText.orderFlow.orderConfirmedMessage', label: 'Order confirmed message' },
      { path: 'uiText.orderFlow.thankYou', label: 'Thank you message' },
      { path: 'uiText.orderFlow.orderScheduled', label: 'Order scheduled message', multiline: true },
      { path: 'uiText.orderFlow.backToHome', label: 'Back to home button label' },
    ],
  },
  {
    title: 'CheckoutPageMUI / CartDrawerMUI',
    fields: [
      { path: 'uiText.app.continueShopping', label: 'Continue shopping button' },
      { path: 'uiText.app.goToCheckout', label: 'Go to checkout button' },
      { path: 'uiText.cart.title', label: 'Cart title' },
      { path: 'uiText.cart.empty', label: 'Cart empty state' },
      { path: 'uiText.cart.subtotal', label: 'Cart subtotal label' },
      { path: 'uiText.checkout.eyebrow', label: 'Checkout eyebrow' },
      { path: 'uiText.checkout.title', label: 'Checkout title' },
      { path: 'uiText.checkout.customerDetails', label: 'Customer details label' },
      { path: 'uiText.checkout.firstName', label: 'First name label' },
      { path: 'uiText.checkout.lastName', label: 'Last name label' },
      { path: 'uiText.checkout.email', label: 'Email label' },
      { path: 'uiText.checkout.phone', label: 'Phone label' },
      { path: 'uiText.checkout.deliveryAddress', label: 'Delivery address label' },
      { path: 'uiText.checkout.notes', label: 'Notes label' },
      { path: 'uiText.checkout.paymentMethod', label: 'Payment method label' },
      { path: 'uiText.checkout.placeOrder', label: 'Place order label' },
      { path: 'uiText.checkout.back', label: 'Back label' },
      { path: 'uiText.checkout.sentTitle', label: 'Thank you title' },
      { path: 'uiText.checkout.sentMessage', label: 'Order submitted message', multiline: true },
      { path: 'uiText.checkout.customerLabel', label: 'Customer label' },
      { path: 'uiText.checkout.deliveryTo', label: 'Delivery to label' },
      { path: 'uiText.checkout.totalAmount', label: 'Total amount label' },
      { path: 'uiText.checkout.backToHome', label: 'Back to home label' },
    ],
  },
  {
    title: 'ContactPageMUI',
    fields: [
      { path: 'uiText.contact.eyebrow', label: 'Contact eyebrow' },
      { path: 'uiText.contact.title', label: 'Contact title' },
      { path: 'uiText.contact.sendMessage', label: 'Send message heading' },
      { path: 'uiText.contact.yourName', label: 'Your name field' },
      { path: 'uiText.contact.yourEmail', label: 'Email field' },
      { path: 'uiText.contact.subject', label: 'Subject field' },
      { path: 'uiText.contact.message', label: 'Message field' },
      { path: 'uiText.contact.sendButton', label: 'Send form button' },
      { path: 'uiText.contact.phoneLabel', label: 'Phone label' },
      { path: 'uiText.contact.emailLabel', label: 'Email label' },
      { path: 'uiText.contact.location', label: 'Location label' },
      { path: 'uiText.contact.quickContact', label: 'Quick contact label' },
      { path: 'uiText.contact.whatsapp', label: 'WhatsApp label' },
      { path: 'uiText.contact.viber', label: 'Viber label' },
      { path: 'uiText.contact.instagram', label: 'Instagram label' },
      { path: 'uiText.contact.facebook', label: 'Facebook label' },
      { path: 'contactInfo.phone', label: 'Contact phone value' },
      { path: 'contactInfo.email', label: 'Contact email value' },
      { path: 'contactInfo.location', label: 'Contact location value' },
      { path: 'contactInfo.instagram', label: 'Instagram handle' },
      { path: 'contactInfo.facebook', label: 'Facebook handle' },
    ],
  },
  {
    title: 'CorporateCateringPageMUI',
    fields: [
      { path: 'uiText.corporate.eyebrow', label: 'Corporate eyebrow' },
      { path: 'uiText.corporate.title', label: 'Corporate title' },
      { path: 'uiText.corporate.companyName', label: 'Company name field' },
      { path: 'uiText.corporate.contactPerson', label: 'Contact person field' },
      { path: 'uiText.corporate.emailLabel', label: 'Corporate email label' },
      { path: 'uiText.corporate.phoneLabel', label: 'Corporate phone label' },
      { path: 'uiText.corporate.eventDate', label: 'Event date label' },
      { path: 'uiText.corporate.numberOfPeople', label: 'Number of people label' },
      { path: 'uiText.corporate.deliveryAddress', label: 'Delivery address label' },
      { path: 'uiText.corporate.mealType', label: 'Meal type label' },
      { path: 'uiText.corporate.budgetPerPerson', label: 'Budget per person label' },
      { path: 'uiText.corporate.dietaryRequirements', label: 'Dietary requirements label' },
      { path: 'uiText.corporate.successMessage', label: 'Success message', multiline: true },
      { path: 'uiText.corporate.featureTitle', label: 'Feature title' },
    ],
  },
  {
    title: 'Validation & Accessibility',
    fields: [
      { path: 'validationMessages.checkout.firstName', label: 'Checkout first name validation' },
      { path: 'validationMessages.checkout.lastName', label: 'Checkout last name validation' },
      { path: 'validationMessages.checkout.emailRequired', label: 'Checkout email required validation' },
      { path: 'validationMessages.checkout.emailInvalid', label: 'Checkout email invalid validation' },
      { path: 'validationMessages.checkout.phoneRequired', label: 'Checkout phone required validation' },
      { path: 'validationMessages.checkout.phoneInvalid', label: 'Checkout phone invalid validation' },
      { path: 'validationMessages.checkout.deliveryAddress', label: 'Checkout delivery validation' },
      { path: 'validationMessages.corporate.companyName', label: 'Corporate company validation' },
      { path: 'validationMessages.corporate.contactPerson', label: 'Corporate contact validation' },
      { path: 'validationMessages.corporate.emailRequired', label: 'Corporate email required validation' },
      { path: 'validationMessages.corporate.emailInvalid', label: 'Corporate email invalid validation' },
      { path: 'validationMessages.corporate.phone', label: 'Corporate phone validation' },
      { path: 'validationMessages.corporate.eventDate', label: 'Corporate date validation' },
      { path: 'validationMessages.corporate.numberOfPeople', label: 'Corporate guest validation' },
      { path: 'validationMessages.corporate.deliveryAddress', label: 'Corporate delivery validation' },
      { path: 'validationMessages.corporate.mealType', label: 'Corporate meal type validation' },
    ],
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'hero-main',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=500&fit=crop',
    altKey: 'nepaliFood',
    gridRow: { sm: '1 / 3' },
    minHeight: { xs: 360, sm: 500 },
  },
  {
    id: 'hero-spices',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=240&fit=crop',
    altKey: 'spices',
    minHeight: 220,
  },
  {
    id: 'hero-catering',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=240&fit=crop',
    altKey: 'eventCatering',
    minHeight: 220,
  },
];