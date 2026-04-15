import React, { createContext, useContext, useState } from "react";

const CartDrawerContext = createContext(null);

export function CartDrawerProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartDrawerContext.Provider value={{ isCartOpen, setIsCartOpen }}>
      {children}
    </CartDrawerContext.Provider>
  );
}

export function useCartDrawer() {
  const ctx = useContext(CartDrawerContext);
  if (!ctx) throw new Error("useCartDrawer must be used within CartDrawerProvider");
  return ctx;
}
