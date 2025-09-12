// src/components/MetricCard.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

const MetricCard = ({ title, value, unit = "", trend, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    red: 'text-red-400 bg-red-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10'
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[0]}`} />
        {trend !== undefined && (
          <TrendingUp className={`w-4 h-4 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`} />
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value}{unit}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </div>
  );
};

export default MetricCard;