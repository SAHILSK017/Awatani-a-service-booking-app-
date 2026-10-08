import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Users,
  Briefcase,
  Activity,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Plus,
  BarChart3,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  UserPlus,
  Package,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';
import { getAllUsers, getAllBookings, getAllServices } from '../../services/adminService';
import { formatPrice, formatDate, cn } from '../../utils/helpers';
import { Badge } from '../../components/ui/Badge';
import { CountUp } from '../../components/admin/CountUp';
import { Sparkline } from '../../components/admin/Sparkline';
import { Avatar } from '../../components/admin/Avatar';
import { Tooltip } from '../../components/admin/Tooltip';
import { DashboardSkeleton } from '../../components/admin/DashboardSkeleton';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
};

const computePeriodTrend = (items, getDate) => {
  const now = new Date();
  const curStart = daysAgo(30);
  const prevStart = daysAgo(60);
  let current = 0;
  let previous = 0;
  items.forEach((item) => {
    const t = new Date(getDate(item));
    if (Number.isNaN(t.getTime())) return;
    if (t >= curStart && t <= now) current += 1;
    else if (t >= prevStart && t < curStart) previous += 1;
  });
  if (previous === 0) {
    return { pct: current > 0 ? 100 : null, direction: current > 0 ? 'up' : 'flat' };
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  return { pct: Math.abs(pct), direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat' };
};

const buildDailySeries = (items, getDate, days = 7, getValue = () => 1) => {
  const map = {};
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = daysAgo(i);
    map[d.toISOString().slice(0, 10)] = 0;
  }
  items.forEach((item) => {
    const t = new Date(getDate(item));
    if (Number.isNaN(t.getTime())) return;
    const key = startOfDay(t).toISOString().slice(0, 10);
    if (key in map) map[key] += getValue(item);
  });
  return Object.keys(map)
    .sort()
    .map((key) => ({
      key,
      label: new Date(key).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      value: map[key],
    }));
};

const relativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 shadow-md">
      <p className="text-[11px] text-[#64748B] mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-[#111827]">{formatPrice(payload[0].value)}</p>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkers: 0,
    totalRevenue: 0,
    activeServices: 0,
    completedJobs: 0,
  });
  const [usersList, setUsersList] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [activity, setActivity] = useState([]);
  const [revenueSeries, setRevenueSeries] = useState([]);
  const [userSpark, setUserSpark] = useState([]);
  const [workerSpark, setWorkerSpark] = useState([]);
  const [trends, setTrends] = useState({ users: null, workers: null });
  const [range, setRange] = useState(7);
  const [bookingsRaw, setBookingsRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        const [usersData, bookingsData, servicesData] = await Promise.all([
          getAllUsers(),
          getAllBookings(),
          getAllServices(),
        ]);

        let revenue = 0;
        let completedJobs = 0;
        bookingsData.forEach((b) => {
          if (b.status === 'completed') {
            revenue += b.service?.price || 0;
            completedJobs += 1;
          }
        });

        const regUsers = usersData.filter((u) => u.role === 'user');
        const regWorkers = usersData.filter((u) => u.role === 'worker');

        setStats({
          totalUsers: regUsers.length,
          totalWorkers: regWorkers.length,
          totalRevenue: revenue,
          activeServices: servicesData.length,
          completedJobs,
        });

        const sortedUsers = [...regUsers].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setUsersList(sortedUsers.slice(0, 5));

        const workerMap = {};
        regWorkers.forEach((w) => {
          workerMap[w._id] = { ...w, jobsCompleted: 0 };
        });
        bookingsData.forEach((b) => {
          if (b.status === 'completed' && b.worker?._id && workerMap[b.worker._id]) {
            workerMap[b.worker._id].jobsCompleted += 1;
          }
        });
        setWorkersList(
          Object.values(workerMap)
            .sort((a, b) => b.jobsCompleted - a.jobsCompleted)
            .slice(0, 5)
        );

        setUserSpark(buildDailySeries(regUsers, (u) => u.createdAt).map((d) => d.value));
        setWorkerSpark(buildDailySeries(regWorkers, (w) => w.createdAt).map((d) => d.value));
        setTrends({
          users: computePeriodTrend(regUsers, (u) => u.createdAt),
          workers: computePeriodTrend(regWorkers, (w) => w.createdAt),
        });

        setBookingsRaw(bookingsData);

        // Activity from real events
        const events = [];
        sortedUsers.slice(0, 8).forEach((u) => {
          events.push({
            id: `user-${u._id}`,
            type: 'user',
            title: 'New user registered',
            detail: u.name || u.email,
            at: u.createdAt,
            status: 'success',
          });
        });
        bookingsData.forEach((b) => {
          if (b.status === 'completed') {
            events.push({
              id: `job-${b._id}`,
              type: 'job',
              title: 'Worker completed a job',
              detail: b.service?.name || 'Service booking',
              at: b.updatedAt || b.createdAt,
              status: 'success',
            });
          } else if (b.status === 'pending') {
            events.push({
              id: `book-${b._id}`,
              type: 'booking',
              title: 'New booking created',
              detail: b.service?.name || 'Booking',
              at: b.createdAt,
              status: 'warning',
            });
          }
        });
        servicesData.slice(0, 5).forEach((s) => {
          events.push({
            id: `svc-${s._id}`,
            type: 'service',
            title: 'Service available',
            detail: s.name,
            at: s.createdAt || s.updatedAt,
            status: 'info',
          });
        });
        events.sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));
        setActivity(events.slice(0, 6));
        setUpdatedAt(new Date());
      } catch (err) {
        console.error(err);
        setError('Unable to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const completed = bookingsRaw.filter((b) => b.status === 'completed');
    setRevenueSeries(
      buildDailySeries(
        completed,
        (b) => b.updatedAt || b.createdAt,
        range,
        (b) => b.service?.price || 0
      )
    );
  }, [bookingsRaw, range]);

  const activityIcons = {
    user: UserPlus,
    job: CheckCircle2,
    booking: CalendarCheck,
    service: Package,
  };

  const quickActions = [
    {
      title: 'Add User',
      description: 'Create a new platform user',
      icon: UserPlus,
      path: '/admin/users',
    },
    {
      title: 'Add Worker',
      description: 'Onboard a service worker',
      icon: Briefcase,
      path: '/admin/workers',
    },
    {
      title: 'Add Service',
      description: 'Publish a new service',
      icon: Plus,
      path: '/admin/services',
    },
    {
      title: 'View Analytics',
      description: 'Deep-dive platform metrics',
      icon: BarChart3,
      path: '/admin/analytics',
    },
  ];

  const kpis = useMemo(
    () => [
      {
        key: 'users',
        label: 'Platform Users',
        value: stats.totalUsers,
        icon: Users,
        iconTone: 'bg-[#EEF2FF] text-[#5B3DF5]',
        spark: userSpark,
        sparkColor: '#5B3DF5',
        trend: trends.users,
        fallback: 'Registered customers',
      },
      {
        key: 'workers',
        label: 'Active Workers',
        value: stats.totalWorkers,
        icon: Briefcase,
        iconTone: 'bg-sky-50 text-sky-600',
        spark: workerSpark,
        sparkColor: '#3B82F6',
        trend: trends.workers,
        fallback: 'Available workforce',
      },
      {
        key: 'revenue',
        label: 'Gross Revenue',
        value: stats.totalRevenue,
        icon: IndianRupee,
        iconTone: 'bg-emerald-50 text-emerald-600',
        isCurrency: true,
        spark: revenueSeries.map((d) => d.value),
        sparkColor: '#10B981',
        fallback: 'Total platform revenue',
      },
      {
        key: 'services',
        label: 'Active Services',
        value: stats.activeServices,
        icon: Activity,
        iconTone: 'bg-amber-50 text-amber-600',
        spark: [stats.activeServices],
        sparkColor: '#F59E0B',
        fallback: 'Currently available',
      },
    ],
    [stats, userSpark, workerSpark, revenueSeries, trends]
  );

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white px-8 py-10 text-center shadow-sm max-w-md">
          <p className="text-sm font-semibold text-[#111827] mb-2">Something went wrong</p>
          <p className="text-sm text-[#64748B] mb-5">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-lg bg-[#5B3DF5] px-4 py-2 text-sm font-medium text-white hover:bg-[#4C2FE0] transition-colors active:scale-[0.98]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-10">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-4"
      >
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEF2FF] text-[#5B3DF5] text-[11px] font-semibold tracking-wide border border-[#E0E7FF] mb-3">
            <Sparkles size={12} />
            Admin Control Center
          </span>
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[#111827] leading-tight">
            Overview Dashboard
          </h1>
          <p className="text-sm text-[#64748B] mt-1.5 max-w-xl leading-relaxed">
            Monitor platform performance, users, workers and service activity in real time.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-[#64748B] bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          Last updated {updatedAt ? 'just now' : '—'}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.key}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              whileHover={{ y: -2, transition: { duration: 0.18 } }}
              className="group rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[12px] font-medium text-[#64748B] tracking-wide">{kpi.label}</p>
                  <p className="mt-2 text-[30px] sm:text-[32px] font-bold tracking-tight text-[#111827] leading-none">
                    {kpi.isCurrency ? (
                      <CountUp
                        value={kpi.value}
                        formatter={(n) => formatPrice(Math.round(n))}
                      />
                    ) : (
                      <CountUp value={kpi.value} />
                    )}
                  </p>
                </div>
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', kpi.iconTone)}>
                  <Icon size={17} strokeWidth={1.75} />
                </div>
              </div>

              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  {kpi.trend && kpi.trend.pct != null ? (
                    <div
                      className={cn(
                        'inline-flex items-center gap-1 text-xs font-semibold',
                        kpi.trend.direction === 'down' ? 'text-[#EF4444]' : 'text-[#10B981]'
                      )}
                    >
                      {kpi.trend.direction === 'down' ? (
                        <ArrowDownRight size={13} />
                      ) : (
                        <ArrowUpRight size={13} />
                      )}
                      {kpi.trend.pct}% from last period
                    </div>
                  ) : (
                    <p className="text-xs text-[#64748B] truncate">{kpi.fallback}</p>
                  )}
                </div>
                <Sparkline data={kpi.spark} color={kpi.sparkColor} className="opacity-80" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.section
          variants={fadeUp}
          custom={0.2}
          initial="hidden"
          animate="show"
          className="xl:col-span-2 rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-semibold text-[#111827]">Revenue Overview</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Completed booking revenue</p>
            </div>
            <div className="inline-flex p-0.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
              {[7, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setRange(d)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 active:scale-[0.98]',
                    range === d
                      ? 'bg-white text-[#111827] shadow-sm border border-[#E2E8F0]'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  )}
                >
                  Last {d} days
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            {revenueSeries.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5B3DF5" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#5B3DF5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                  />
                  <YAxis
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <RechartsTooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#5B3DF5"
                    strokeWidth={2.25}
                    fill="url(#revenueFill)"
                    animationDuration={900}
                    dot={false}
                    activeDot={{ r: 4, fill: '#5B3DF5', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-3">
                  <IndianRupee size={18} className="text-[#94A3B8]" />
                </div>
                <p className="text-sm font-medium text-[#1E293B]">No revenue in this period</p>
                <p className="text-xs text-[#64748B] mt-1">
                  Charts update automatically when completed bookings exist.
                </p>
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          variants={fadeUp}
          custom={0.3}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#111827]">Platform Activity</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Live snapshot of key totals</p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Users', value: stats.totalUsers, tone: 'bg-[#5B3DF5]' },
              { label: 'Workers', value: stats.totalWorkers, tone: 'bg-[#3B82F6]' },
              { label: 'Completed jobs', value: stats.completedJobs, tone: 'bg-[#10B981]' },
              { label: 'Active services', value: stats.activeServices, tone: 'bg-[#F59E0B]' },
            ].map((row) => {
              const peak = Math.max(
                stats.totalUsers,
                stats.totalWorkers,
                stats.completedJobs,
                stats.activeServices,
                1
              );
              const width = Math.max(8, Math.round((row.value / peak) * 100));
              return (
                <div key={row.label} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/70 px-3.5 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium text-[#64748B]">{row.label}</span>
                    <span className="text-sm font-bold text-[#111827]">{row.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white border border-[#E2E8F0] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className={cn('h-full rounded-full', row.tone)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* Quick Actions */}
      <motion.section
        variants={fadeUp}
        custom={0.35}
        initial="hidden"
        animate="show"
      >
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-[#111827]">Quick Actions</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Jump into common admin workflows</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.title}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className="group text-left rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-[#C7D2FE] hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#5B3DF5] group-hover:bg-[#EEF2FF] transition-colors mb-3">
                  <Icon size={16} />
                </div>
                <p className="text-sm font-semibold text-[#111827]">{action.title}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{action.description}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* Tables + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Users */}
        <motion.section
          variants={fadeUp}
          custom={0.4}
          initial="hidden"
          animate="show"
          className="xl:col-span-2 rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden"
        >
          <div className="flex items-start justify-between gap-3 px-5 sm:px-6 py-5 border-b border-[#E2E8F0]">
            <div>
              <h2 className="text-lg font-semibold text-[#111827]">Recent Users</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Latest users registered on the platform</p>
            </div>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5B3DF5] hover:text-[#4C2FE0] transition-colors shrink-0"
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]/80">
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Action'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersList.map((user, idx) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.25 }}
                    className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors duration-150"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <span className="font-medium text-[#111827]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#64748B]">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant="primary" className="normal-case tracking-normal">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#64748B] text-xs">
                      {formatDate(user.createdAt) || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <Tooltip content="Manage user">
                        <button
                          type="button"
                          onClick={() => navigate('/admin/users')}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </Tooltip>
                    </td>
                  </motion.tr>
                ))}
                {usersList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#64748B]">
                      No users found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#E2E8F0]">
            {usersList.map((user) => (
              <div key={user._id} className="p-4 flex items-start gap-3">
                <Avatar name={user.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#111827] truncate">{user.name}</p>
                    <Badge variant="primary" className="normal-case tracking-normal shrink-0">
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#64748B] truncate mt-0.5">{user.email}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-[#64748B]">
                    <span className="inline-flex items-center gap-1 text-[#10B981] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Active
                    </span>
                    <span>{formatDate(user.createdAt) || '—'}</span>
                  </div>
                </div>
              </div>
            ))}
            {usersList.length === 0 && (
              <p className="p-8 text-center text-sm text-[#64748B]">No users found yet.</p>
            )}
          </div>
        </motion.section>

        {/* Activity Feed */}
        <motion.section
          variants={fadeUp}
          custom={0.45}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#111827]">Recent Activity</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Latest platform events</p>
          </div>
          <div className="space-y-1">
            {activity.map((item, idx) => {
              const Icon = activityIcons[item.type] || Clock;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * idx, duration: 0.25 }}
                  className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-[#5B3DF5]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-[#111827] leading-snug">{item.title}</p>
                    <p className="text-xs text-[#64748B] truncate mt-0.5">{item.detail}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-1">{relativeTime(item.at)}</p>
                  </div>
                  <span
                    className={cn(
                      'mt-1 w-1.5 h-1.5 rounded-full shrink-0',
                      item.status === 'success' && 'bg-[#10B981]',
                      item.status === 'warning' && 'bg-[#F59E0B]',
                      item.status === 'info' && 'bg-[#3B82F6]'
                    )}
                  />
                </motion.div>
              );
            })}
            {activity.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-sm text-[#64748B]">No recent activity yet.</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>

      {/* Top Workers */}
      <motion.section
        variants={fadeUp}
        custom={0.5}
        initial="hidden"
        animate="show"
        className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden"
      >
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 py-5 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">Top Workers</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Ranked by completed jobs</p>
          </div>
          <Link
            to="/admin/workers"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5B3DF5] hover:text-[#4C2FE0] transition-colors shrink-0"
          >
            View all workers <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]/80">
                {['Rank', 'Worker', 'Completed Jobs', 'Rating', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workersList.map((worker, idx) => {
                const rank = idx + 1;
                return (
                  <motion.tr
                    key={worker._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.25 }}
                    className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors duration-150"
                  >
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold border',
                          rank === 1 && 'bg-[#EEF2FF] text-[#5B3DF5] border-[#E0E7FF]',
                          rank === 2 && 'bg-slate-50 text-slate-600 border-slate-200',
                          rank === 3 && 'bg-amber-50 text-amber-700 border-amber-100',
                          rank > 3 && 'bg-white text-[#64748B] border-[#E2E8F0]'
                        )}
                      >
                        #{rank}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={worker.name} size="sm" />
                        <div className="min-w-0">
                          <p className="font-medium text-[#111827] truncate">{worker.name}</p>
                          <p className="text-xs text-[#64748B] truncate">{worker.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#111827]">
                        <CheckCircle2 size={14} className="text-[#10B981]" />
                        {worker.jobsCompleted}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#94A3B8] text-xs">—</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        Active
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
              {workersList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-[#64748B]">
                    No workers found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
};

export default AdminDashboard;
