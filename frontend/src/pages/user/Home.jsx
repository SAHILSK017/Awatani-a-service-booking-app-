import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Wallet,
  Snowflake,
  Wrench,
  Droplets,
  Home as HomeIcon,
  Sparkles,
  Loader2,
  Users,
} from 'lucide-react';
import { getServices } from '../../services/categoryService.js';
import { getMyBookings } from '../../services/bookingService.js';
import { formatPrice } from '../../utils/helpers.js';

// Visual helper mapping for service categories and cards
const getServiceVisuals = (service) => {
  const name = (service?.name || '').toLowerCase();
  const catName = (service?.category?.name || '').toLowerCase();
  const combined = `${name} ${catName}`;

  if (combined.includes('ac') || combined.includes('air') || combined.includes('cool')) {
    return {
      image: '/images/dashboard/service_ac.jpg',
      badge: 'PLUMBING',
      badgeStyle: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: Snowflake,
      iconBg: 'bg-blue-600 shadow-blue-500/20',
      displayTitle: 'AC Repair',
      displayDesc: 'Fix AC issues, installation and maintenance',
    };
  }

  if (combined.includes('table') || combined.includes('carpent') || combined.includes('wood') || combined.includes('furniture')) {
    return {
      image: '/images/dashboard/service_carpenter.jpg',
      badge: 'CARPENTER',
      badgeStyle: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: Wrench,
      iconBg: 'bg-orange-600 shadow-orange-500/20',
      displayTitle: 'Table Repair',
      displayDesc: 'Repair all wooden furniture and tables',
    };
  }

  if (combined.includes('line') || combined.includes('electr') || combined.includes('wire') || combined.includes('light') || combined.includes('switch')) {
    return {
      image: '/images/dashboard/service_electrical.jpg',
      badge: 'ELECTRICITY',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Zap,
      iconBg: 'bg-amber-500 shadow-amber-500/20',
      displayTitle: 'Line Fix',
      displayDesc: 'Wiring, switch repair and electrical work',
    };
  }

  if (combined.includes('plumb') || combined.includes('pipe') || combined.includes('leak') || combined.includes('tap') || combined.includes('water')) {
    return {
      image: '/images/dashboard/service_plumbing.jpg',
      badge: 'PLUMBING',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Droplets,
      iconBg: 'bg-blue-600 shadow-blue-500/20',
      displayTitle: 'Plumbing',
      displayDesc: 'Leakage, pipe repair and installation',
    };
  }

  return {
    image: '/images/dashboard/service_plumbing.jpg',
    badge: service?.category?.name?.toUpperCase() || 'SERVICE',
    badgeStyle: 'bg-purple-50 text-[#5B3DF5] border-purple-200',
    icon: Sparkles,
    iconBg: 'bg-[#5B3DF5] shadow-purple-500/20',
    displayTitle: service?.name || 'Home Care',
    displayDesc: service?.description || 'Professional home repairs and maintenance',
  };
};

const Home = () => {
  const navigate = useNavigate();
  const [servicesList, setServicesList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parse logged-in user safely
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
          getMyBookings().catch(() => []),
        ]);
        setServicesList(servicesData || []);
        setBookings(bookingsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBookService = (service) => {
    navigate('/user/booking', { state: { selectedService: service } });
  };

  const activeBookings = bookings.filter(
    (b) => b.status === 'accepted' || b.status === 'pending' || b.status === 'assigned'
  );
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const totalSpent = completedBookings.reduce((sum, b) => sum + (b.service?.price || 0), 0);

  return (
    <div className="w-full space-y-7 pb-12 animate-in fade-in slide-in-from-bottom-3 duration-400">
      
      {/* ========================================================
          HERO BANNER SECTION
      ======================================================== */}
      <section className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-r from-[#091126] via-[#0E1A3D] to-[#14234C] border border-slate-800/60 shadow-xl shadow-indigo-950/20 text-white min-h-[360px] md:min-h-[390px] flex items-center">
        
        {/* Right Architectural Luxury Villa Visual */}
        <div className="absolute top-0 right-0 w-full lg:w-[48%] h-full pointer-events-none overflow-hidden hidden sm:block">
          <img
            src="/images/dashboard/hero_villa.jpg"
            alt="Premium Home Services"
            className="w-full h-full object-cover object-center opacity-85 lg:opacity-100"
          />
          {/* Subtle gradient vignette blending photo to dark background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#091126] via-[#0E1A3D]/50 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091126]/40 via-transparent to-transparent pointer-events-none" />

          {/* Floating Card: Home Care Made Simple */}
          <div className="hidden lg:flex absolute top-7 right-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/90 items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
              <HomeIcon size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Home Care</p>
              <p className="text-[11px] font-semibold text-slate-500">Made Simple</p>
            </div>
            {/* Curved arrow accent */}
            <svg
              className="w-5 h-5 text-indigo-400 -ml-1 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17l9.2-9.2M17 17V8H8" />
            </svg>
          </div>

          {/* Floating Card: 500+ Verified Experts */}
          <div className="hidden lg:flex absolute bottom-7 right-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xl border border-white/90 items-center gap-3">
            <div>
              <p className="text-base font-extrabold text-slate-900 leading-none">500+</p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Verified Experts
              </p>
            </div>
            <div className="flex -space-x-1.5 overflow-hidden items-center pl-1">
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#5B3DF5] text-[10px] text-white font-bold flex items-center justify-center">
                AK
              </span>
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-500 text-[10px] text-white font-bold flex items-center justify-center">
                RS
              </span>
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-purple-100 text-[11px] text-[#5B3DF5] font-extrabold flex items-center justify-center">
                +
              </span>
            </div>
          </div>
        </div>

        {/* Hero Left Content */}
        <div className="relative z-10 p-6 sm:p-9 md:p-11 max-w-2xl w-full">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-[11px] font-bold tracking-wider uppercase mb-4 shadow-xs">
            <ShieldCheck size={14} className="text-indigo-400" />
            VERIFIED EXPERTS ON-DEMAND
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-white tracking-tight leading-tight mb-3">
            Good morning, {user.name || 'sahil'} 👋
          </h1>

          {/* Supporting Text */}
          <p className="text-indigo-100/90 text-sm sm:text-base mb-7 max-w-xl font-normal leading-relaxed">
            Trusted professionals for home repairs and maintenance. Book verified experts and get your work done hassle-free.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3.5 mb-8">
            <button
              onClick={() => {
                const el = document.getElementById('explore-services');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#5B3DF5] hover:bg-[#4E30E5] text-white px-6 py-3 rounded-xl font-bold transition-all text-sm shadow-lg shadow-[#5B3DF5]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
            >
              Explore Services <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/user/mybookings')}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md px-6 py-3 rounded-xl font-semibold transition-all text-sm shadow-xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              View My Bookings ({bookings.length})
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-6 pt-5 border-t border-white/10 text-xs font-semibold text-indigo-200/90">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-indigo-400" />
              <span>Verified Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-indigo-400" />
              <span>Quick & Reliable</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-indigo-400" />
              <span>On-time Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          STATS SECTION (4 KPI CARDS)
      ======================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Bookings */}
        <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex items-center justify-between group">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5B3DF5] flex items-center justify-center shrink-0">
              <Calendar size={22} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#5B3DF5] uppercase tracking-wider mb-0.5">
                TOTAL BOOKINGS
              </p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none mb-1">
                {bookings.length}
              </p>
              <p className="text-xs text-slate-500 font-normal">All time bookings</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-purple-50 text-[#5B3DF5] flex items-center justify-center shrink-0 self-start mt-0.5">
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex items-center justify-between group">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock size={22} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">
                ACTIVE BOOKINGS
              </p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none mb-1">
                {activeBookings.length}
              </p>
              <p className="text-xs text-slate-500 font-normal">Currently in progress</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 self-start mt-0.5">
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex items-center justify-between group">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">
                COMPLETED
              </p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none mb-1">
                {completedBookings.length}
              </p>
              <p className="text-xs text-slate-500 font-normal">Successfully completed</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 self-start mt-0.5">
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </div>
        </div>

        {/* Total Spent */}
        <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex items-center justify-between group">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Wallet size={22} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">
                TOTAL SPENT
              </p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none mb-1">
                {formatPrice(totalSpent)}
              </p>
              <p className="text-xs text-slate-500 font-normal">Across all services</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 self-start mt-0.5">
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </div>
        </div>

      </section>

      {/* ========================================================
          EXPLORE SERVICES SECTION
      ======================================================== */}
      <section id="explore-services" className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Explore Services</h2>
            <p className="text-sm text-slate-500 mt-1">
              Top-rated certified professionals ready to assist you.
            </p>
          </div>
          <button
            onClick={() => navigate('/user/services')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5B3DF5] hover:text-[#4E30E5] transition-colors group cursor-pointer"
          >
            <span>View All Services</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-white border border-slate-200/80 p-4 space-y-4 animate-pulse"
              >
                <div className="h-44 bg-slate-100 rounded-xl w-full" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
                <div className="h-8 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesList.map((service) => {
              const visuals = getServiceVisuals(service);
              const IconComponent = visuals.icon;

              return (
                <div
                  key={service._id}
                  className="group rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                  onClick={() => handleBookService(service)}
                >
                  {/* Top Image with Category Badge */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={visuals.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3.5 right-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs border bg-white/95 ${visuals.badgeStyle}`}
                      >
                        {visuals.badge}
                      </span>
                    </div>
                  </div>

                  {/* Overlapping Floating Service Icon */}
                  <div className="relative px-5 pt-0">
                    <div
                      className={`-mt-5 mb-2 w-11 h-11 rounded-xl shadow-md flex items-center justify-center text-white ${visuals.iconBg} group-hover:scale-105 transition-transform`}
                    >
                      <IconComponent size={20} />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-5 pb-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#5B3DF5] transition-colors mb-1.5 capitalize">
                        {service.name || visuals.displayTitle}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                        {service.description || visuals.displayDesc}
                      </p>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                          Starting at
                        </p>
                        <p className="text-lg font-black text-slate-900">
                          ₹{service.price}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-[#5B3DF5] group-hover:border-[#5B3DF5] group-hover:text-white transition-all shadow-xs">
                        <ArrowRight
                          size={15}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
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
