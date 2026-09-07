import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Users, Briefcase, Activity, IndianRupee, Loader2, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllUsers, getAllBookings, getAllServices } from '../../services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { formatPrice } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalWorkers: 0, totalRevenue: 0, activeServices: 0 });
  const [usersList, setUsersList] = useState([]);
  const [workersList, setWorkersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, bookingsData, servicesData] = await Promise.all([
          getAllUsers(), getAllBookings(), getAllServices()
        ]);
        let revenue = 0; 
        bookingsData.forEach(b => { if (b.status === 'completed') revenue += b.service?.price || 0; });
        
        const regUsers = usersData.filter(u => u.role === 'user');
        const regWorkers = usersData.filter(u => u.role === 'worker');

        setStats({ totalUsers: regUsers.length, totalWorkers: regWorkers.length, totalRevenue: revenue, activeServices: servicesData.length });
        setUsersList(regUsers.slice(0, 5));
        
        const workerMap = {};
        regWorkers.forEach(w => workerMap[w._id] = { ...w, jobsCompleted: 0 });
        bookingsData.forEach(b => { if (b.status === 'completed' && b.worker && workerMap[b.worker._id]) workerMap[b.worker._id].jobsCompleted += 1; });
        
        setWorkersList(Object.values(workerMap).sort((a, b) => b.jobsCompleted - a.jobsCompleted).slice(0, 5));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-primary h-10 w-10" /></div>;

  return (
    <div className="w-full space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest mb-2 inline-block shadow-xs">Admin Control</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Overview Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time platform metrics, user management, and worker operations.</p>
        </div>
      </div>

      {/* Colorful KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 border border-violet-200/80 bg-gradient-to-br from-violet-50 via-purple-50/40 to-white shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-violet-700 uppercase tracking-wider">Platform Users</h3>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/25">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900">{stats.totalUsers}</p>
            <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full"><ArrowUpRight size={12} className="mr-0.5"/> 12%</span>
          </div>
        </div>

        <div className="rounded-2xl p-5 border border-sky-200/80 bg-gradient-to-br from-sky-50 via-blue-50/40 to-white shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-sky-700 uppercase tracking-wider">Active Workers</h3>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900">{stats.totalWorkers}</p>
            <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full"><ArrowUpRight size={12} className="mr-0.5"/> 4%</span>
          </div>
        </div>

        <div className="rounded-2xl p-5 border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Gross Revenue</h3>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900">{formatPrice(stats.totalRevenue)}</p>
          </div>
        </div>

        <div className="rounded-2xl p-5 border border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-50/40 to-white shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider">Active Services</h3>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-amber-500/25">
              <Activity size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900">{stats.activeServices}</p>
          </div>
        </div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Users Table */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users size={16} className="text-muted-foreground"/> Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead className="text-right">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersList.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="primary">{user.role}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {usersList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">No users found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Workers Table */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase size={16} className="text-muted-foreground"/> Top Workers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker Details</TableHead>
                  <TableHead className="text-right">Jobs Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workersList.map((worker) => (
                  <TableRow key={worker._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{worker.name}</span>
                        <span className="text-xs text-muted-foreground">{worker.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-success" />
                        <span className="font-bold">{worker.jobsCompleted}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {workersList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">No workers found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AdminDashboard;