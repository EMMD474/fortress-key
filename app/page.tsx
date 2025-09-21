import NavBar from "@/components/navigation/NavBar";
import SlideShow from "@/components/SlideShow";
import Image from "next/image";
import React from "react";

const HomePage = () => {
  return (
    <div className="pt-16 sm:pt-20 flex flex-col items-center min-h-screen px-4 sm:px-8 lg:px-14">
      <div className="w-full max-w-6xl flex flex-col items-center justify-center text-center">
        <h3 className="mt-4 sm:mt-8 lg:mt-10 text-xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 text-blue-800 leading-tight">
          Secure your digital life with Fortress Key
        </h3>

        <p className="text-sm sm:text-lg lg:text-2xl text-gray-500 font-medium max-w-4xl leading-relaxed">
          The world's most trusted password manager. Store, generate, and
          autofill passwords with military-grade encryption.
        </p>
      </div>

      {/* slide show */}
      <div className="w-full">
        <SlideShow />
      </div>
    </div>
  );
};

export default HomePage;
