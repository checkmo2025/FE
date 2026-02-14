"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type HeaderTitleContextType = {
  customTitle: string | null;
  setCustomTitle: (title: string | null) => void;
};

const HeaderTitleContext = createContext<HeaderTitleContextType | undefined>(
  undefined
);

export function HeaderTitleProvider({ children }: { children: ReactNode }) {
  const [customTitle, setCustomTitle] = useState<string | null>(null);

  return (
    <HeaderTitleContext.Provider value={{ customTitle, setCustomTitle }}>
      {children}
    </HeaderTitleContext.Provider>
  );
}

export function useHeaderTitle() {
  const context = useContext(HeaderTitleContext);
  if (context === undefined) {
    throw new Error("useHeaderTitle must be used within a HeaderTitleProvider");
  }
  return context;
}
