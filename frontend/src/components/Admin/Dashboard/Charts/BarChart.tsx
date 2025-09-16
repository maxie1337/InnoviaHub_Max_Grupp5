import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardStats } from '../../../../types/admin';

interface BarChartProps {
  dashboardStats?: DashboardStats;
}

const BarChart: React.FC<BarChartProps> = ({ dashboardStats: _ }) => {
  // Sample data - in real app, this would come from API
  const data = [
    { name: 'Meeting Room A', bookings: 45, utilization: 85 },
    { name: 'Meeting Room B', bookings: 38, utilization: 72 },
    { name: 'Conference Hall', bookings: 52, utilization: 90 },
    { name: 'Desk #1', bookings: 28, utilization: 65 },
    { name: 'Desk #2', bookings: 35, utilization: 78 },
    { name: 'Desk #3', bookings: 42, utilization: 82 },
    { name: 'Desk #4', bookings: 31, utilization: 70 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="bookings" 
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
