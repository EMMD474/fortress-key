"use client";

import CredentialsForm from "@/components/AddCredentials";
import SideNav from "@/components/navigation/SideNav";
import PopUpButton from "@/components/ui/PopUpButton";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen((prev) => !prev);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Listen for navbar hamburger events to open the mobile sidenav
  useEffect(() => {
    const handler = (e: Event) => {
      setMobileNavOpen(true);
    };
    window.addEventListener("toggle-sidenav", handler as EventListener);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("toggle-sidenav", handler as EventListener);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div>
      {/* Sidebar */}
      {/* Desktop sidebar (hidden on small screens) */}
      <SideNav className="hidden lg:flex" />

      {/* Main content area shifted to the right */}
      <div className="lg:ml-60 min-h-screen flex flex-col">
        {/* Top right action button */}
        <div className="p-4 flex justify-end">
          <PopUpButton onClick={toggleModal} />
        </div>

        {/* Page content */}
        <main className="dark:bg-gray-950 flex-1 p-6 mt-5">{children}</main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gray-900 p-4 sm:p-6 rounded-md shadow-lg max-w-md w-full"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <button
                title="close expense form modal"
                onClick={toggleModal}
                className="absolute top-2 right-2 text-white hover:text-gray-300"
              >
                <X className="w-6 h-6 cursor-pointer hover:text-red-500 transition ease-out duration-200" />
              </button>
              <CredentialsForm onClose={toggleModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
