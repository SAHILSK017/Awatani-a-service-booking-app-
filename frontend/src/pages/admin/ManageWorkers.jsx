import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Loader2, UserX, Search, CheckCircle2, IndianRupee } from 'lucide-react';
import { getAllUsers, getAllBookings, deleteUser } from '../../services/adminService';
import { formatPrice, cn } from '../../utils/helpers';
import { Avatar } from '../../components/admin/Avatar';
import { Tooltip } from '../../components/admin/Tooltip';
import { AdminToast } from '../../components/admin/AdminToast';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminModal } from '../../components/admin/AdminModal';

const ManageWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmWorker, setDeleteConfirmWorker] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchWorkersAndStats = async () => {
    try {
      const [usersData, bookingsData] = await Promise.all([getAllUsers(), getAllBookings()]);
      const workerProfiles = usersData.filter((u) => u.role === 'worker');

      const workerMap = {};
      workerProfiles.forEach((w) => {
        workerMap[w._id] = { ...w, jobsCompleted: 0, totalGenerated: 0 };
      });

      bookingsData.forEach((b) => {
        if (b.status === 'completed' && b.worker && workerMap[b.worker._id]) {
          workerMap[b.worker._id].jobsCompleted += 1;
          workerMap[b.worker._id].totalGenerated += b.service?.price || 0;
        }
      });

      setWorkers(Object.values(workerMap).sort((a, b) => b.jobsCompleted - a.jobsCompleted));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkersAndStats();
  }, []);

  const handleDeleteWorker = async (id) => {
    setActionLoading(true);
    try {
      await deleteUser(id);
      setDeleteConfirmWorker(null);
      showToast('Worker successfully deleted!', 'success');
      fetchWorkersAndStats();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete worker', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredWorkers = useMemo(
    () =>
      workers.filter(
        (w) =>
          w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(w._id).toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [workers, searchQuery]
  );

  const totals = useMemo(
    () => ({
      workers: workers.length,
      jobs: workers.reduce((s, w) => s + w.jobsCompleted, 0),
      earned: workers.reduce((s, w) => s + w.totalGenerated, 0),
    }),
    [workers]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-[#5B3DF5] h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-10">
      <AdminToast toast={toast} />

      <AdminPageHeader
        badge="Workforce"
        icon={Briefcase}
        title="Manage Workers"
        description="Track worker performance, completed jobs, and earnings."
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Workers', value: totals.workers, icon: Briefcase, tone: 'bg-[#EEF2FF] text-[#5B3DF5]' },
          { label: 'Jobs Completed', value: totals.jobs, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-600' },
          { label: 'Total Earned', value: formatPrice(totals.earned), icon: IndianRupee, tone: 'bg-sky-50 text-sky-600' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#64748B]">{card.label}</p>
                  <p className="mt-1.5 text-2xl font-bold tracking-tight text-[#111827]">{card.value}</p>
                </div>
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', card.tone)}>
                  <Icon size={16} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm max-w-md w-full">
          <Search size={16} className="text-[#94A3B8] shrink-0" />
          <input
            type="text"
            placeholder="Search workers by name, email, or ID..."
            className="w-full bg-transparent border-none outline-none text-sm font-medium text-[#1E293B] placeholder:text-[#94A3B8]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-xs text-[#64748B]">
          <span className="font-semibold text-[#111827]">{filteredWorkers.length}</span> workers
        </p>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]/80">
                {['Rank', 'Worker', 'Worker ID', 'Jobs Completed', 'Total Earned', 'Status', 'Action'].map(
                  (h) => (
                    <th
                      key={h}
                      className={cn(
                        'px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]',
                        h === 'Action' && 'text-right',
                        h === 'Jobs Completed' && 'text-center'
                      )}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((worker, idx) => {
                const rank = idx + 1;
                return (
                  <motion.tr
                    key={worker._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.3) }}
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
                      <span className="text-[11px] font-mono text-[#94A3B8] select-all">
                        {String(worker._id).slice(0, 8)}…
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111827] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-md">
                        <CheckCircle2 size={13} className="text-[#10B981]" />
                        {worker.jobsCompleted}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-[#111827]">
                        {formatPrice(worker.totalGenerated)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Tooltip content="Delete worker">
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmWorker(worker)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-rose-50 transition-colors"
                        >
                          <UserX size={16} />
                        </button>
                      </Tooltip>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredWorkers.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-medium text-[#111827]">No workers found</p>
            <p className="text-xs text-[#64748B] mt-1">
              {workers.length === 0
                ? 'No workers have been onboarded yet.'
                : 'Try a different search query.'}
            </p>
          </div>
        )}
      </motion.div>

      <AdminModal
        open={!!deleteConfirmWorker}
        onClose={() => setDeleteConfirmWorker(null)}
        title="Delete Worker"
        maxWidth="max-w-md"
      >
        {deleteConfirmWorker && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="h-12 w-12 bg-rose-50 text-[#EF4444] rounded-xl flex items-center justify-center mx-auto border border-rose-100">
              <UserX size={22} />
            </div>
            <p className="text-sm text-[#64748B] text-center leading-relaxed">
              Permanently delete{' '}
              <strong className="text-[#111827] font-semibold">{deleteConfirmWorker.name}</strong>?
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmWorker(null)}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteWorker(deleteConfirmWorker._id)}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-[#EF4444] hover:bg-red-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default ManageWorkers;
