import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, CheckCircle, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { getServices } from '../../services/categoryService.js';
import { getMyBookings } from '../../services/bookingService.js';
import { Card, CardContent } from '../../components/ui/Card';
import { formatPrice } from '../../utils/helpers.js';

const getCategoryTheme = (categoryName = '') => {
  const name = (categoryName || '').toLowerCase();
  if (name.includes('plumb')) return { 
    border: 'border-cyan-200 hover:border-cyan-400', 
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-200', 
    iconBg: 'from-cyan-500 to-blue-600 shadow-cyan-500/20' 
  };
  if (name.includes('electr')) return { 
    border: 'border-amber-200 hover:border-amber-400', 
    badge: 'bg-amber-50 text-amber-700 border-amber-200', 
    iconBg: 'from-amber-500 to-yellow-500 shadow-amber-500/20' 
  };
  if (name.includes('carpent')) return { 
    border: 'border-orange-200 hover:border-orange-400', 
    badge: 'bg-orange-50 text-orange-700 border-orange-200', 
    iconBg: 'from-orange-500 to-amber-600 shadow-orange-500/20' 
  };
  if (name.includes('ac') || name.includes('air') || name.includes('repair')) return { 
    border: 'border-teal-200 hover:border-teal-400', 
    badge: 'bg-teal-50 text-teal-700 border-teal-200', 
    iconBg: 'from-teal-500 to-emerald-600 shadow-teal-500/20' 
  };
  if (name.includes('clean')) return { 
    border: 'border-emerald-200 hover:border-emerald-400', 
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
    iconBg: 'from-emerald-500 to-teal-600 shadow-emerald-500/20' 
  };
  if (name.includes('paint')) return { 
    border: 'border-pink-200 hover:border-pink-400', 
    badge: 'bg-pink-50 text-pink-700 border-pink-200', 
    iconBg: 'from-pink-500 to-rose-500 shadow-pink-500/20' 
  };
  return { 
    border: 'border-violet-200 hover:border-violet-400', 
    badge: 'bg-violet-50 text-violet-700 border-violet-200', 
    iconBg: 'from-violet-600 to-indigo-600 shadow-indigo-500/20' 
  };
};

const Home = () => {
  const navigate = useNavigate();
  const [servicesList, setServicesList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Safe parse user
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user')) || {};
  } catch (e) {
    console.error(e);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, bookingsData] = await Promise.all([
          getServices(),
          getMyBookings().catch(() => []) 
        ]);
        setServicesList(servicesData || []);
        setBookings(bookingsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBookService = (service) => {
    navigate('/user/booking', { state: { selectedService: service } });
  };

  const activeBookings = bookings.filter(b => b.status === 'accepted' || b.status === 'pending' || b.status === 'assigned');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalSpent = completedBookings.reduce((sum, b) => sum + (b.service?.price || 0), 0);

  return (
    <div className="w-full space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Vibrant Hero Welcome Banner */}
      <section className="rounded-3xl p-8 md:p-10 border border-violet-400/30 shadow-xl shadow-indigo-500/10 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-10 -bottom-10 w-64 h-64 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
           <Star className="w-72 h-72 text-white" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Verified Experts On-Demand
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 drop-shadow-sm">
            Good morning, {user.name || 'Friend'} 👋
          </h1>
          <p className="text-indigo-100 text-base sm:text-lg mb-8 max-w-xl font-normal leading-relaxed">
            Need home repairs or routine maintenance? Book trusted verified professionals in minutes.
          </p>
          
          <div className="flex flex-wrap items-center gap-3.5">
            <button 
              onClick={() => document.getElementById('explore-services').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-indigo-700 hover:bg-slate-50 px-6 py-3 rounded-xl font-bold transition-all text-sm shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              Explore Services <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => navigate('/user/mybookings')}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md px-6 py-3 rounded-xl font-semibold transition-all text-sm shadow-sm hover:-translate-y-0.5"
            >
              View My Bookings ({bookings.length})
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Summary Colorful KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Bookings */}
        <div className="rounded-2xl p-5 border border-violet-200/80 bg-gradient-to-br from-violet-50 via-purple-50/40 to-white shadow-sm hover:shadow-md hover:border-violet-400 transition-all duration-200 flex justify-between items-center group">
          <div>
            <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-1">Total Bookings</p>
            <p className="text-3xl font-black text-slate-900">{bookings.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-violet-500/30 group-hover:scale-105 transition-transform">
            <BookOpen size={22} />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="rounded-2xl p-5 border border-sky-200/80 bg-gradient-to-br from-sky-50 via-blue-50/40 to-white shadow-sm hover:shadow-md hover:border-sky-400 transition-all duration-200 flex justify-between items-center group">
          <div>
            <p className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">Active Bookings</p>
            <p className="text-3xl font-black text-slate-900">{activeBookings.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/30 group-hover:scale-105 transition-transform">
            <Clock size={22} />
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-2xl p-5 border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-200 flex justify-between items-center group">
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Completed</p>
            <p className="text-3xl font-black text-slate-900">{completedBookings.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <CheckCircle size={22} />
          </div>
        </div>

        {/* Total Spent */}
        <div className="rounded-2xl p-5 border border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-50/40 to-white shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-200 flex justify-between items-center group">
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Total Spent</p>
            <p className="text-3xl font-black text-slate-900">{formatPrice(totalSpent)}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <Star size={22} />
          </div>
        </div>

      </section>

      {/* Explore Services */}
      <section id="explore-services" className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Explore Services</h2>
            <p className="text-sm text-slate-500 mt-0.5">Top-rated certified professionals ready to assist you.</p>
          </div>
        </div>

        {loading ? (
           <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 text-violet-600 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {servicesList.map((service) => {
              const theme = getCategoryTheme(service.category?.name);
              return (
                <div 
                  key={service._id} 
                  className={`group rounded-2xl bg-white border ${theme.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-1 relative overflow-hidden`} 
                  onClick={() => handleBookService(service)}
                >
                  <div className={`h-1.5 w-full bg-gradient-to-r ${theme.iconBg}`} />

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${theme.iconBg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <span className="text-2xl">{service.category?.icon || '✨'}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${theme.badge}`}>
                        {service.category?.name || 'Standard'}
                      </span>
                    </div>
                    
                    <div className="mb-auto">
                      <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5 font-bold">Starting at</p>
                        <p className="text-xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                          ₹{service.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 group-hover:shadow-lg transition-all group-hover:scale-105">
                        <span>Book</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
