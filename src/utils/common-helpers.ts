export const subtotal = (cartItems: Array<{ price: number; quantity: number }>) => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const deliveryCharge = (cartItems: Array<{ price: number; quantity: number }>) => cartItems.length > 0 ? 150 : 0;
export const total = (cartItems: Array<{ price: number; quantity: number }>) => subtotal(cartItems) + deliveryCharge(cartItems);
