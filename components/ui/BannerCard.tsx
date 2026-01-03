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
      className={`${bgColor} border ${borderColor} rounded-xl padding-card transition-all duration-200 hover:scale-[1.02] sm:hover:scale-105 cursor-pointer min-h-[120px] sm:min-h-[140px] xl:min-h-[160px] 2xl:min-h-[180px]`}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3 xl:mb-4">
        <Icon className={`icon-md ${color}`} />
        <span className={`text-responsive-lg font-bold ${color}`}>{count}</span>
      </div>
      <h3 className="text-responsive-sm font-medium text-slate-300 line-clamp-2">{title}</h3>
    </div>
  );
};

export default BannerCard;
