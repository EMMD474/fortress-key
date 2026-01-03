"use client";

import CredentialsForm from "@/components/AddCredentials";
import SideNav from "@/components/navigation/SideNav";
import PopUpButton from "@/components/ui/PopUpButton";
import { useSideNav } from "@/context/SideNavContext";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen((prev) => !prev);
  const { isOpen, isCollapsed, toggle } = useSideNav();

  return (
    <div className="flex">
      {/* Sidebar for desktop */}
      <div className={`hidden lg:block transition-all duration-300 ${isCollapsed ? "w-16 sm:w-20" : "w-56 sm:w-60"}`}>
        <SideNav />
      </div>

      {/* Animated sidebar for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-sidenav"
            initial={{ x: -64, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -64, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          >
            {/* Overlay click closes sidenav */}
            <div
              className="absolute inset-0"
              onClick={() => toggle()}
            ></div>

            {/* Actual sidenav content */}
            <motion.div
              initial={{ x: -224 }}
              animate={{ x: 0 }}
              exit={{ x: -224 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`relative ${isCollapsed ? "w-16 sm:w-20" : "w-56 sm:w-60"} h-full bg-gray-900`}
            >
              <SideNav onNavigate={toggle} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "lg:ml-16 xl:ml-20" : "lg:ml-56 xl:ml-60"} min-h-screen flex flex-col`}>
        <div className="px-4 sm:px-6 py-2 flex justify-end">
          <PopUpButton onClick={toggleModal} />
        </div>

        <main className="dark:bg-gray-950 flex-1 p-4 sm:p-5 lg:p-6 mt-2">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gray-900 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-lg max-w-xs sm:max-w-md lg:max-w-lg w-full"
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
                <X className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:text-red-500 transition ease-out duration-200" />
              </button>
              <CredentialsForm onClose={toggleModal} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
