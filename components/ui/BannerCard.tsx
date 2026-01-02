import React from "react";

type BannerCardProps = {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
};

const BannerCard = ({
  title,
  count,
  icon: Icon,
  color,
  bgColor,
  borderColor,
}: BannerCardProps) => {
  return (
    <div
      className={`${bgColor} border ${borderColor} rounded-xl p-4 sm:p-5 transition-all duration-200 hover:scale-105 cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
        <span className={`text-xl sm:text-2xl font-bold ${color}`}>{count}</span>
      </div>
      <h3 className="text-xs sm:text-sm font-medium text-slate-300">{title}</h3>
    </div>
  );
};

export default BannerCard;
