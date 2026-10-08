import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader.jsx';
import { getMyBookings, deleteBooking } from '../../services/bookingService.js';
import { formatPrice, formatDate } from '../../utils/helpers.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Loader2,
  Eye,
  XOctagon,
  BookOpen,
  Calendar,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [deleteConfirmBooking, setDeleteConfirmBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    setCancelLoading(true);
    try {
      await deleteBooking(id);
      setDeleteConfirmBooking(null);
      showToast('Booking successfully cancelled!', 'success');
      const data = await getMyBookings();
      setBookings(data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel booking', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter((b) => b.status === statusFilter);
  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});

  if (loading && bookings.length === 0) {
    return (
      <div className="p-16 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-[#5B3DF5] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400 pb-12">
      {/* Toast Alert */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">My Bookings</h1>
          <p className="text-sm text-[#64748B] mt-1">Manage and track your service appointments in real-time.</p>
        </div>
        <Link
          to="/user/services"
          className="inline-flex items-center gap-2 bg-[#5B3DF5] hover:bg-[#4E30E5] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} />
          <span>Book New Service</span>
        </Link>
      </div>

      {/* KPI Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-[#5B3DF5] uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-black text-[#111827]">{bookings.length}</p>
        </div>
        <div className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">Pending</p>
          <p className="text-2xl font-black text-amber-900">{statusCounts.pending || 0}</p>
        </div>
        <div className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">Accepted</p>
          <p className="text-2xl font-black text-blue-900">{statusCounts.accepted || 0}</p>
        </div>
        <div className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Completed</p>
          <p className="text-2xl font-black text-emerald-900">{statusCounts.completed || 0}</p>
        </div>
        <div className="rounded-2xl p-4 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">Cancelled</p>
          <p className="text-2xl font-black text-rose-900">{statusCounts.cancelled || 0}</p>
        </div>
      </div>

      {/* Table Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Status Filter Tabs */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 overflow-x-auto bg-slate-50/50">
          {['all', 'pending', 'accepted', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#5B3DF5] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div>
          {filteredBookings.length > 0 ? (
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="w-[300px]">Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => {
                  const basePrice = booking.service?.price || 0;
                  const urgencyFee = booking.urgency === 'priority' ? 99 : booking.urgency === 'express' ? 199 : 0;
                  const discount =
                    booking.discountCode === 'WELCOME10'
                      ? Math.round(basePrice * 0.1)
                      : booking.discountCode === 'SAVINGS50'
                        ? 50
                        : 0;
                  const computedTotal = Math.max(0, basePrice + urgencyFee - discount);

                  return (
                    <TableRow key={booking._id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#111827]">{booking.service?.name || 'Service Record'}</span>
                          <span className="text-xs text-[#64748B] line-clamp-1">{booking.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-xs font-semibold text-[#64748B]">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-[#5B3DF5]" />
                          {formatDate(booking.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.status === 'completed'
                              ? 'success'
                              : booking.status === 'pending'
                                ? 'warning'
                                : booking.status === 'cancelled'
                                  ? 'danger'
                                  : 'info'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-extrabold text-[#111827]">
                        {formatPrice(computedTotal)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/booking/${booking._id}`}
                            className="p-2 bg-purple-50 text-[#5B3DF5] hover:bg-[#5B3DF5] hover:text-white rounded-xl transition-all shadow-2xs"
                            title="View details"
                          >
                            <Eye size={16} />
                          </Link>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => setDeleteConfirmBooking(booking)}
                              className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-2xs cursor-pointer"
                              title="Cancel Booking"
                            >
                              <XOctagon size={16} />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 bg-purple-50 text-[#5B3DF5] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-100">
                <BookOpen size={28} />
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-1">No bookings found</h3>
              <p className="text-xs text-[#64748B] mb-5">
                {statusFilter !== 'all'
                  ? `No bookings with "${statusFilter}" status.`
                  : "You haven't booked any services yet."}
              </p>
              <Link
                to="/user/services"
                className="inline-flex items-center gap-1.5 bg-[#5B3DF5] hover:bg-[#4E30E5] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-colors"
              >
                <span>Book a Service</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {deleteConfirmBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111827]">Cancel Booking</h3>
                <p className="text-xs text-[#64748B]">This action cannot be undone.</p>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmBooking(null)}
                className="w-1/2 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-xs cursor-pointer"
              >
                Keep
              </button>
              <button
                onClick={() => handleCancelBooking(deleteConfirmBooking._id)}
                disabled={cancelLoading}
                className="w-1/2 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs flex items-center justify-center transition-colors text-xs cursor-pointer"
              >
                {cancelLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm Cancel'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
