// app/components/AddExpenseButton.tsx
"use client";

import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";

interface PopUpButtonProps {
  onClick: () => void;
}

const PopUpButton: React.FC<PopUpButtonProps> = ({ onClick }) => {
  const { status } = useSession();



  // if (status === "unauthenticated") return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 lg:bottom-8 xl:bottom-10 right-4 sm:right-6 lg:right-8 xl:right-10 z-50">
      <button
        onClick={onClick}
        className="group bg-blue-600 text-white p-3 sm:p-3.5 lg:p-4 xl:p-5 rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 cursor-pointer hover:scale-110"
        aria-label="Add new credential"
      >
        <Plus
          className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 transition-transform duration-300 ease-out group-hover:rotate-45"
          color="black"
        />
      </button>
    </div>
  );
};

export default PopUpButton;