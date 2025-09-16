import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { DashboardStats } from '../../../../types/admin';

interface PieChartProps {
  dashboardStats?: DashboardStats;
}

const PieChart: React.FC<PieChartProps> = ({ dashboardStats }) => {
  // Use real data if available, otherwise fallback to mock data
  const data = dashboardStats?.bookingStats 
    ? [
        { name: 'Active', value: dashboardStats.bookingStats.activeBookings, color: '#10b981' },
        { name: 'Completed', value: dashboardStats.bookingStats.completedBookings, color: '#3b82f6' },
        { name: 'Cancelled', value: dashboardStats.bookingStats.cancelledBookings, color: '#ef4444' },
        { name: 'Pending', value: dashboardStats.bookingStats.totalBookings - dashboardStats.bookingStats.activeBookings - dashboardStats.bookingStats.completedBookings - dashboardStats.bookingStats.cancelledBookings, color: '#f59e0b' },
      ]
    : [
        { name: 'Active', value: 89, color: '#10b981' },
        { name: 'Completed', value: 156, color: '#3b82f6' },
        { name: 'Cancelled', value: 23, color: '#ef4444' },
        { name: 'Pending', value: 12, color: '#f59e0b' },
      ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {data.name}
          </p>
          <p className="text-sm" style={{ color: data.payload.color }}>
            Bookings: {data.value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentage: {((data.value / 280) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show label for slices less than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontSize: '12px',
              color: '#6b7280'
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
