import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle, IndianRupee, MapPin, Calendar, Loader2, Clock, User, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWorkerBookings } from '../../services/bookingService';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatPrice } from '../../utils/helpers';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const WorkerDashboard = () => {
  const [stats, setStats] = useState({ totalJobs: 0, completedJobs: 0, earnings: 0, activeJobs: 0 });
  const [historyJobs, setHistoryJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const jobsData = await getWorkerBookings();
      
      let completedCount = 0;
      let totalEarnings = 0;
      let activeCount = 0;
      let history = [];
      
      jobsData.forEach(job => {
        if (job.status !== 'pending') {
          history.push(job);
          if (job.status === 'completed') {
            completedCount++;
            totalEarnings += job.service?.price || 0;
          }
          if (job.status === 'accepted') {
            activeCount++;
          }
        }
      });
      setStats({ totalJobs: history.length, completedJobs: completedCount, earnings: totalEarnings, activeJobs: activeCount });
      setHistoryJobs(history.reverse());
    } catch (err) { console.error(err); } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const completionRate = stats.totalJobs > 0 ? Math.round((stats.completedJobs / stats.totalJobs) * 100) : 0;

  if (loading && historyJobs.length === 0) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;

  return (
    <div className="w-full space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Good morning, {currentUser?.name || 'Worker'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Here’s what’s happening with your services today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold transition-all text-sm shadow-xs"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-violet-600' : ''} /> Refresh
          </button>
          <button 
            onClick={() => navigate('/worker/available-jobs')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-95 rounded-xl font-bold transition-all text-sm shadow-md shadow-violet-500/25"
          >
            <Briefcase size={15} /> Find Jobs
          </button>
        </div>
      </div>

      {/* Colorful KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 border border-violet-200/80 bg-gradient-to-br from-violet-50 via-purple-50/40 to-white shadow-xs hover:shadow-md transition-all flex justify-between items-center group">
          <div>
            <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-1">Total Jobs</p>
            <p className="text-2xl font-black text-slate-900">{stats.totalJobs}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-violet-500/25 group-hover:scale-105 transition-transform">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="rounded-2xl p-5 border border-sky-200/80 bg-gradient-to-br from-sky-50 via-blue-50/40 to-white shadow-xs hover:shadow-md transition-all flex justify-between items-center group">
          <div>
            <p className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">Active Now</p>
            <p className="text-2xl font-black text-slate-900">{stats.activeJobs}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <Clock size={20} />
          </div>
        </div>

        <div className="rounded-2xl p-5 border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white shadow-xs hover:shadow-md transition-all flex justify-between items-center group">
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Completed</p>
            <p className="text-2xl font-black text-slate-900">{stats.completedJobs}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="rounded-2xl p-5 border border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-50/40 to-white shadow-xs hover:shadow-md transition-all flex justify-between items-center group">
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Total Earned</p>
            <p className="text-2xl font-black text-slate-900">{formatPrice(stats.earnings)}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <IndianRupee size={20} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground tracking-tight">Recent Jobs</h2>
            <button onClick={() => navigate('/worker/bookings')} className="text-sm font-medium text-primary hover:underline">
              View all
            </button>
          </div>
          
          <div className="space-y-3">
            {historyJobs.slice(0, 5).map((job) => (
              <Card key={job._id} className="overflow-hidden hover:border-primary/30 transition-colors">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer bg-background hover:bg-secondary/20"
                  onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center text-lg border border-border shrink-0">
                      {job.service?.category?.icon || '🔧'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate text-sm">{job.service?.name || 'Service'}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1 truncate"><MapPin size={12} /> {job.address}</span>
                        <span>• {timeAgo(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 pl-4">
                    <span className="font-bold text-foreground text-sm">₹{job.service?.price}</span>
                    <Badge variant={job.status === 'completed' ? 'success' : job.status === 'accepted' ? 'primary' : 'warning'}>
                      {job.status}
                    </Badge>
                    {expandedJob === job._id ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedJob === job._id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-border bg-secondary/10">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mt-2">
                          <div>
                            <p className="text-muted-foreground text-xs font-medium mb-1">Customer</p>
                            <p className="font-medium text-foreground flex items-center gap-1"><User size={14} /> {job.user?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs font-medium mb-1">Booked On</p>
                            <p className="font-medium text-foreground flex items-center gap-1"><Calendar size={14} /> {new Date(job.bookingDate || job.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs font-medium mb-1">Payment</p>
                            <p className="font-medium text-foreground capitalize">{job.paymentMethod || 'Cash'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs font-medium mb-1">Urgency</p>
                            <Badge variant={job.urgency === 'express' ? 'warning' : job.urgency === 'priority' ? 'primary' : 'default'}>
                              {job.urgency || 'Standard'}
                            </Badge>
                          </div>
                        </div>
                        {job.notes && (
                          <div className="mt-4 p-3 bg-secondary border border-border rounded-md text-sm text-foreground">
                            <span className="font-semibold">Note:</span> {job.notes}
                          </div>
                        )}
                        <div className="mt-4 flex justify-end">
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/booking/${job._id}`); }}
                            className="text-xs font-medium bg-background border border-border hover:bg-secondary text-foreground px-3 py-1.5 rounded-md transition-colors shadow-sm"
                          >
                            View Full Details →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
            {historyJobs.length === 0 && (
              <Card className="p-8 text-center bg-secondary/10">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3 border border-border">
                  <Briefcase className="text-muted-foreground w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">No jobs yet</h3>
                <p className="text-muted-foreground text-xs mb-4">Start by accepting available service requests</p>
                <button onClick={() => navigate('/worker/available-jobs')} className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm transition-colors shadow-sm">
                  Browse Jobs
                </button>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column: Performance & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="currentColor" className="text-secondary border border-border" strokeWidth="8" fill="none" />
                    <motion.circle 
                      cx="60" cy="60" r="50" 
                      stroke="currentColor"
                      className={completionRate >= 70 ? 'text-success' : completionRate >= 40 ? 'text-warning' : 'text-danger'}
                      strokeWidth="8" fill="none" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - completionRate / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-foreground">{completionRate}%</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {completionRate >= 70 ? 'Excellent performance' : completionRate >= 40 ? 'Good, keep improving' : 'Needs attention'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { label: 'Available Jobs', desc: 'Browse new requests', icon: Briefcase, path: '/worker/available-jobs', color: 'text-primary' },
                  { label: 'My Jobs', desc: 'View assigned work', icon: CheckCircle, path: '/worker/bookings', color: 'text-success' },
                  { label: 'Earnings', desc: 'Track your income', icon: IndianRupee, path: '/worker/earnings', color: 'text-warning' },
                  { label: 'Profile', desc: 'Update your info', icon: User, path: '/worker/profile', color: 'text-info' },
                ].map(action => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-3 p-3 rounded-md bg-background border border-border hover:bg-secondary hover:border-primary/30 transition-all text-left group"
                  >
                    <div className={`p-2 rounded-md bg-secondary border border-border shadow-sm group-hover:bg-background ${action.color}`}>
                      <action.icon size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm leading-tight">{action.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
};

export default WorkerDashboard;