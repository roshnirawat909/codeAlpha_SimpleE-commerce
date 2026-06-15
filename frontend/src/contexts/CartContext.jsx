import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'cart';

function readCart() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readCart());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
  }, [items]);

  const addItem = (productId, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => String(item.productId) === String(productId));
      if (existing) {
        return current.map((item) =>
          String(item.productId) === String(productId)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { productId, quantity }];
    });
  };

  const updateQty = (productId, delta) => {
    setItems((current) =>
      current
        .map((item) =>
          String(item.productId) === String(productId)
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const setQty = (productId, quantity) => {
    setItems((current) =>
      current
        .map((item) =>
          String(item.productId) === String(productId) ? { ...item, quantity: Math.max(0, quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId) => {
    setItems((current) => current.filter((item) => String(item.productId) !== String(productId)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const value = useMemo(
    () => ({ items, totalItems, addItem, updateQty, setQty, removeItem, clearCart }),
    [items, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
