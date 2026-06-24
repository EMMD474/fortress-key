import React from "react";

type CardProps = {
  icon: React.ReactNode;
  heading: string;
  description: string;
};

const Card = ({ icon, heading, description }: CardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl padding-card transition-all duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] bg-white/5 dark:bg-gray-800/20 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-blue-500/10 min-h-[220px] sm:min-h-[240px] lg:min-h-[280px] xl:min-h-[320px] 2xl:min-h-[360px]">
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 text-left flex flex-col h-full">
        <div className="flex items-center justify-center icon-lg rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-400 mb-4 sm:mb-5 lg:mb-6 xl:mb-8 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shrink-0">
          {icon}
        </div>
        <h3 className="text-responsive-md font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 group-hover:text-blue-400 transition-colors">
          {heading}
        </h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Card;
