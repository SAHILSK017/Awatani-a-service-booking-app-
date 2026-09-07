import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader.jsx';
import { getMyBookings, deleteBooking } from '../../services/bookingService.js';
import { formatPrice, formatDate } from '../../utils/helpers.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, ShieldAlert, Loader2, MoreHorizontal, Eye, XOctagon } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
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

  const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);
  const statusCounts = bookings.reduce((acc, booking) => { acc[booking.status] = (acc[booking.status] || 0) + 1; return acc; }, {});

  if (loading && bookings.length === 0) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-md shadow-lg border ${
          toast.type === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-danger/10 border-danger/20 text-danger'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Colorful Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">My Bookings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your service appointments in real-time.</p>
        </div>
        <Link 
          to="/user/services" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-violet-500/25 hover:shadow-lg transition-all self-start sm:self-auto"
        >
          Book New Service
        </Link>
      </div>

      {/* Colorful KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-50 via-purple-50/40 to-white border border-violet-200/80 shadow-xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-violet-700 uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-black text-slate-900">{bookings.length}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-50 via-yellow-50/40 to-white border border-amber-200/80 shadow-xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">Pending</p>
          <p className="text-2xl font-black text-amber-900">{statusCounts.pending || 0}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-sky-50 via-blue-50/40 to-white border border-sky-200/80 shadow-xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-1">Accepted</p>
          <p className="text-2xl font-black text-sky-900">{statusCounts.accepted || 0}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white border border-emerald-200/80 shadow-xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Completed</p>
          <p className="text-2xl font-black text-emerald-900">{statusCounts.completed || 0}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-rose-50 via-pink-50/40 to-white border border-rose-200/80 shadow-xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider mb-1">Cancelled</p>
          <p className="text-2xl font-black text-rose-900">{statusCounts.cancelled || 0}</p>
        </div>
      </div>

      {/* Table Container */}
      <Card className="border-slate-200/80 shadow-md">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 overflow-x-auto bg-slate-50/40">
          {['all', 'pending', 'accepted', 'completed', 'cancelled'].map((status) => (
            <button key={status} onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                statusFilter === status 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25' 
                  : 'bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700 border border-slate-200'
              }`}>
              {status}
            </button>
          ))}
        </div>

        <div className="p-0">
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
                  const discount = booking.discountCode === 'WELCOME10' ? Math.round(basePrice * 0.1) : booking.discountCode === 'SAVINGS50' ? 50 : 0;
                  const computedTotal = Math.max(0, basePrice + urgencyFee - discount);
                  
                  return (
                    <TableRow key={booking._id} className="hover:bg-violet-50/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{booking.service?.name || 'Service Record'}</span>
                          <span className="text-xs text-slate-500 line-clamp-1">{booking.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-xs font-semibold text-slate-600">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-violet-500" />
                          {formatDate(booking.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.status === 'completed' ? 'success' : booking.status === 'pending' ? 'warning' : booking.status === 'cancelled' ? 'danger' : 'info'}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-extrabold text-slate-900">
                        {formatPrice(computedTotal)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/booking/${booking._id}`} className="p-2 bg-violet-100 text-violet-700 hover:bg-violet-600 hover:text-white rounded-lg transition-all shadow-xs" title="View details">
                            <Eye size={16} />
                          </Link>
                          {booking.status === 'pending' && (
                            <button
                                onClick={() => setDeleteConfirmBooking(booking)}
                                className="p-2 bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white rounded-lg transition-all shadow-xs"
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
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-border"><BookOpen className="text-muted-foreground w-8 h-8" /></div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No bookings found</h3>
              <p className="text-muted-foreground text-sm mb-6">You haven't booked any services yet.</p>
              <Link to="/user/services" className="inline-flex bg-primary hover:bg-primary-hover text-primary-foreground px-5 py-2.5 rounded-md font-medium text-sm shadow-sm transition-colors">
                Book a Service
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* Cancel Modal */}
      {deleteConfirmBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm bg-background rounded-xl shadow-lg border border-border p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-danger/10 text-danger rounded-full flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Cancel Booking</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmBooking(null)}
                className="w-1/2 py-2 border border-border rounded-md font-medium text-foreground hover:bg-secondary transition-colors text-sm"
              >
                Keep
              </button>
              <button
                onClick={() => handleCancelBooking(deleteConfirmBooking._id)}
                disabled={cancelLoading}
                className="w-1/2 py-2 bg-danger hover:bg-danger/90 text-danger-foreground rounded-md font-medium shadow-sm flex items-center justify-center transition-colors text-sm"
              >
                {cancelLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Cancel'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default MyBookings;
