import React, { useEffect, useState } from 'react';
import { Loader2, BarChart3 } from 'lucide-react';
import { getAllBookings } from '../../services/adminService';
import { getServices } from '../../services/categoryService';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#5B3DF5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#64748B'];

const tooltipStyle = {
  backgroundColor: '#fff',
  borderRadius: '10px',
  border: '1px solid #E2E8F0',
  color: '#111827',
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
  fontSize: '12px',
};

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ earningsTimeline: [], categoryDistribution: [], jobStatus: [] });

  useEffect(() => {
    const generateAnalytics = async () => {
      try {
        const [bookings, services] = await Promise.all([getAllBookings(), getServices()]);
        const statuses = { pending: 0, accepted: 0, completed: 0 };
        bookings.forEach((b) => {
          if (statuses[b.status] !== undefined) statuses[b.status] += 1;
        });

        const jobStatusData = [
          { name: 'Pending', count: statuses.pending, fill: '#F59E0B' },
          { name: 'In Progress', count: statuses.accepted, fill: '#5B3DF5' },
          { name: 'Completed', count: statuses.completed, fill: '#10B981' },
        ];

        const categoryMap = {};
        services.forEach((s) => {
          categoryMap[s.category?.name || 'Uncategorized'] = 0;
        });
        bookings.forEach((b) => {
          const catName = b.service?.category?.name || 'Uncategorized';
          categoryMap[catName] = (categoryMap[catName] || 0) + 1;
        });
        const categoryData = Object.keys(categoryMap)
          .map((key) => ({ name: key, value: categoryMap[key] }))
          .filter((c) => c.value > 0);

        const timelineMap = {};
        bookings.forEach((b) => {
          if (b.status === 'completed') {
            const dateStr = new Date(b.updatedAt || b.createdAt).toLocaleDateString();
            timelineMap[dateStr] = (timelineMap[dateStr] || 0) + (b.service?.price || 0);
          }
        });
        const timelineData = Object.keys(timelineMap)
          .map((date) => ({ date, revenue: timelineMap[date] }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setData({
          earningsTimeline: timelineData,
          categoryDistribution: categoryData,
          jobStatus: jobStatusData,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    generateAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-[#5B3DF5] h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEF2FF] text-[#5B3DF5] text-[11px] font-semibold tracking-wide border border-[#E0E7FF] mb-3">
          <BarChart3 size={12} />
          Insights
        </span>
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#111827]">
          Platform Analytics
        </h1>
        <p className="text-sm text-[#64748B] mt-1.5">
          Visual overview of bookings, revenue, and service performance.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      >
        <h2 className="text-lg font-semibold text-[#111827] mb-6">Revenue Over Time</h2>
        <div className="h-80 w-full">
          {data.earningsTimeline.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.earningsTimeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <RechartsTooltip
                  cursor={{ stroke: '#E2E8F0', strokeWidth: 1, strokeDasharray: '5 5' }}
                  contentStyle={tooltipStyle}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#5B3DF5"
                  strokeWidth={2.5}
                  animationDuration={900}
                  dot={{ r: 3, fill: '#5B3DF5', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 5, fill: '#5B3DF5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[#64748B] text-sm">
              No revenue data yet.
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <h2 className="text-lg font-semibold text-[#111827] mb-6">Bookings by Status</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.jobStatus} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: '#F8FAFC' }} contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={800}>
                  {data.jobStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <h2 className="text-lg font-semibold text-[#111827] mb-6">Bookings by Category</h2>
          <div className="h-64 w-full">
            {data.categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={4}
                    stroke="none"
                    dataKey="value"
                    animationDuration={800}
                  >
                    {data.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={tooltipStyle} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ color: '#64748B', fontSize: '12px', fontWeight: 500 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#64748B] text-sm">
                No category data yet.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
