"use client"

import { createContext, useContext, useState, ReactNode } from "react";

type PasswordModalContextType = {
    isOpen: boolean;
    toggle: () => void;
    setOpen: (open: boolean) => void;
};

const PasswordModalContext = createContext<PasswordModalContextType | undefined>(undefined);

export const PasswordModelProvider = ({ children }: { children: ReactNode}) => {
    const [pwdOpen, setPwdOpen] = useState(false);

    const toggle = () => setPwdOpen((prev) => !prev);
    const setOpen = (open: boolean) => setPwdOpen(open);


}