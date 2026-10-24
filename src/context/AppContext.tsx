import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product, CartItem } from '@/types/product';
import { PRODUCTS } from '@/data/products';

interface AppContextType {
  // Wishlist / Favorites
  favorites: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
  favoriteProducts: Product[];
  favoriteCount: number;

  // Cart
  cart: Record<string, number>; // id -> quantity
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartItems: CartItem[];
  cartSubtotal: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;
  cartItemCount: number;

  // Smart Compare
  compareIds: string[];
  toggleCompare: (productId: string) => boolean; // returns true if added, false if removed
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  comparedProducts: (Product | null)[]; // length 2
}

const AppContext = createContext<AppContextType | null>(null);

// Simulated calculation rules: Free shipping over $50, else $4.99; 8% estimated sales tax
const FREE_SHIPPING_THRESHOLD = 50.0;
const STANDARD_SHIPPING = 4.99;
const TAX_RATE = 0.08;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(['1', '4']); // default items favorited for instant demo
  const [cart, setCart] = useState<Record<string, number>>({ '1': 1 }); // default 1 item in cart for quick testing
  const [compareIds, setCompareIds] = useState<string[]>(['1', '2']); // default 2 items for immediate viva compare demo

  // --- Favorites Logic ---
  const isFavorite = (productId: string) => favorites.includes(productId);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const favoriteProducts = useMemo(() => {
    return PRODUCTS.filter((p) => favorites.includes(p.id));
  }, [favorites]);

  const favoriteCount = favorites.length;

  // --- Cart Logic ---
  const addToCart = (productId: string, quantity: number = 1) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: current + quantity };
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: quantity };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const clearCart = () => setCart({});

  const cartItems: CartItem[] = useMemo(() => {
    const list: CartItem[] = [];
    for (const [id, qty] of Object.entries(cart)) {
      if (qty > 0) {
        const prod = PRODUCTS.find((p) => p.id === id);
        if (prod) {
          list.push({
            product: prod,
            quantity: qty,
            subtotal: +(prod.numericPrice * qty).toFixed(2),
          });
        }
      }
    }
    return list;
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    const sum = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
    return +sum.toFixed(2);
  }, [cartItems]);

  const cartShipping = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  }, [cartSubtotal]);

  const cartTax = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return +(cartSubtotal * TAX_RATE).toFixed(2);
  }, [cartSubtotal]);

  const cartTotal = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return +(cartSubtotal + cartShipping + cartTax).toFixed(2);
  }, [cartSubtotal, cartShipping, cartTax]);

  // --- Compare Logic (Max 2 products) ---
  const isInCompare = (productId: string) => compareIds.includes(productId);

  const toggleCompare = (productId: string): boolean => {
    if (compareIds.includes(productId)) {
      setCompareIds((prev) => prev.filter((id) => id !== productId));
      return false;
    } else {
      setCompareIds((prev) => {
        if (prev.length >= 2) {
          // Replace the second item with the new choice
          return [prev[0], productId];
        }
        return [...prev, productId];
      });
      return true;
    }
  };

  const clearCompare = () => setCompareIds([]);

  const comparedProducts = useMemo(() => {
    const first = PRODUCTS.find((p) => p.id === compareIds[0]) || null;
    const second = PRODUCTS.find((p) => p.id === compareIds[1]) || null;
    return [first, second];
  }, [compareIds]);

  const value: AppContextType = {
    favorites,
    isFavorite,
    toggleFavorite,
    favoriteProducts,
    favoriteCount,

    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartItems,
    cartSubtotal,
    cartShipping,
    cartTax,
    cartTotal,
    cartItemCount,

    compareIds,
    toggleCompare,
    isInCompare,
    clearCompare,
    comparedProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
