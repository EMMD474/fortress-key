"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SideNavContextType = {
  isOpen: boolean;    // For mobile
  isCollapsed: boolean; // For desktop
  toggle: () => void;
  toggleCollapsed: () => void;
  setOpen: (open: boolean) => void;
};

const SideNavContext = createContext<SideNavContextType | undefined>(undefined);

export const SideNavProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const toggleCollapsed = () => setIsCollapsed((prev) => !prev);
  const setOpen = (open: boolean) => setIsOpen(open);

  return (
    <SideNavContext.Provider value={{ isOpen, isCollapsed, toggle, toggleCollapsed, setOpen }}>
      {children}
    </SideNavContext.Provider>
  );
};

export const useSideNav = () => {
  const context = useContext(SideNavContext);
  if (!context) {
    throw new Error("useSideNav must be used within a SideNavProvider");
  }
  return context;
};
