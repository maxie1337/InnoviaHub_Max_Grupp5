import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardStats } from '../../../../types/admin';

interface LineChartProps {
  dashboardStats?: DashboardStats;
}

const LineChart: React.FC<LineChartProps> = ({ dashboardStats }) => {
  // Use real data if available, otherwise fallback to mock data
  const data = dashboardStats?.bookingStats?.bookingsByMonth 
    ? Object.entries(dashboardStats.bookingStats.bookingsByMonth).map(([month, bookings]) => ({
        name: month,
        bookings: bookings,
        users: Math.floor((bookings as number) * 1.5), // Estimate users based on bookings
      }))
    : [
        { name: 'Jan', bookings: 45, users: 120 },
        { name: 'Feb', bookings: 52, users: 135 },
        { name: 'Mar', bookings: 48, users: 128 },
        { name: 'Apr', bookings: 61, users: 142 },
        { name: 'May', bookings: 55, users: 138 },
        { name: 'Jun', bookings: 67, users: 156 },
        { name: 'Jul', bookings: 72, users: 163 },
        { name: 'Aug', bookings: 68, users: 159 },
        { name: 'Sep', bookings: 74, users: 167 },
        { name: 'Oct', bookings: 79, users: 172 },
        { name: 'Nov', bookings: 82, users: 178 },
        { name: 'Dec', bookings: 89, users: 185 },
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
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="bookings" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
