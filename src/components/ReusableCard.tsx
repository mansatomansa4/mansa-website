import React from 'react';

type ReusableCardProps = {
  title: string;
  subtitle?: string;
  className?: string; // optional custom styles
};

const ReusableCard: React.FC<ReusableCardProps> = ({ title, subtitle, className }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md ${className || ''}`}
    >
      <h2 className="text-lg font-semibold text-black dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default ReusableCard;