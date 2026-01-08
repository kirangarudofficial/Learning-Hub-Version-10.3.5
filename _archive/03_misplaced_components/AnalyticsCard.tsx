import React from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, change }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      <p className={`text-xs mt-2 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </p>
    </div>
  );
};