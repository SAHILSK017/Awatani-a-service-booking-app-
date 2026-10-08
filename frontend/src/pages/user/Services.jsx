import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from '../../components/Loader.jsx';
import { getCategories, getServices } from '../../services/categoryService.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Snowflake,
  Wrench,
  Droplets,
  Sparkles,
  X,
  Layers,
  CheckCircle2,
} from 'lucide-react';

// Service visual mapper
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

const Services = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servRes, catRes] = await Promise.all([getServices(), getCategories()]);
        setServices(servRes || []);
        setCategories(catRes || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync if URL query param changes
  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery !== null && urlQuery !== searchTerm) {
      setSearchTerm(urlQuery);
    }
  }, [searchParams]);

  const filteredServices = services.filter((service) => {
    const matchesCategory = !selectedCategory || service.category?._id === selectedCategory;
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (service.name || '').toLowerCase().includes(query) ||
      (service.description || '').toLowerCase().includes(query) ||
      (service.category?.name || '').toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleBookService = (service) => {
    navigate('/user/booking', { state: { selectedService: service } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full space-y-7 pb-16 animate-in fade-in slide-in-from-bottom-3 duration-400">
      
      {/* ========================================================
          HERO BANNER
      ======================================================== */}
      <section className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-r from-[#091126] via-[#0E1A3D] to-[#14234C] border border-slate-800/60 shadow-xl shadow-indigo-950/20 text-white min-h-[280px] md:min-h-[320px] flex items-center">
        
        {/* Right Architectural Luxury Villa Visual */}
        <div className="absolute top-0 right-0 w-full lg:w-[46%] h-full pointer-events-none overflow-hidden hidden sm:block">
          <img
            src="/images/dashboard/hero_villa.jpg"
            alt="Services Catalog"
            className="w-full h-full object-cover object-center opacity-85 lg:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#091126] via-[#0E1A3D]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091126]/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Hero Left Content */}
        <div className="relative z-10 p-6 sm:p-9 md:p-10 max-w-2xl w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-[11px] font-bold tracking-wider uppercase mb-3.5 shadow-xs">
            <ShieldCheck size={14} className="text-indigo-400" />
            VERIFIED SERVICE PROVIDERS
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2.5">
            Explore Services
          </h1>

          {/* Supporting Text */}
          <p className="text-indigo-100/90 text-sm sm:text-base mb-6 max-w-xl font-normal leading-relaxed">
            Browse our full catalog of professional home repair, installation, and cleaning services. Book certified experts with guaranteed upfront pricing.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-white/10 text-xs font-semibold text-indigo-200/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-indigo-400" />
              <span>Verified Experts</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-indigo-400" />
              <span>Quick Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SEARCH AND CATEGORY FILTER TOOLBAR
      ======================================================== */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80 space-y-3.5">
        
        {/* Top Search Row */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by service name or description (e.g. AC repair, plumbing, carpentry...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] focus:bg-white transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Dropdown (for compact screen convenience) */}
          <div className="relative w-full md:w-64 shrink-0 md:hidden">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Layers size={17} />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 focus:border-[#5B3DF5] transition-all text-sm font-semibold text-slate-700 cursor-pointer appearance-none"
            >
              <option value="">All Categories ({services.length})</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 whitespace-nowrap">
            <span>Showing <strong className="text-slate-900">{filteredServices.length}</strong> of {services.length} services</span>
          </div>
        </div>

        {/* Horizontal Category Filter Pills (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === ''
                ? 'bg-[#5B3DF5] text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
            }`}
          >
            All Services ({services.length})
          </button>

          {categories.map((cat) => {
            const count = services.filter((s) => s.category?._id === cat._id).length;
            const isSelected = selectedCategory === cat._id;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer capitalize ${
                  isSelected
                    ? 'bg-[#5B3DF5] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                {cat.name} {count > 0 && <span className="opacity-75">({count})</span>}
              </button>
            );
          })}
        </div>

      </div>

      {/* ========================================================
          SERVICES CATALOG GRID
      ======================================================== */}
      {filteredServices.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredServices.map((service) => {
            const visuals = getServiceVisuals(service);
            const IconComponent = visuals.icon;

            return (
              <motion.div
                key={service._id}
                variants={itemVariants}
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
                      {service.category?.name?.toUpperCase() || visuals.badge}
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookService(service);
                      }}
                      className="flex items-center gap-1.5 bg-[#5B3DF5] hover:bg-[#4E30E5] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <span>Book</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 bg-purple-50 text-[#5B3DF5] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No services found</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            {searchTerm || selectedCategory
              ? "We couldn't find any services matching your search or filter criteria. Try adjusting your search query."
              : 'There are currently no active services in this catalog.'}
          </p>
          {(searchTerm || selectedCategory) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="px-4 py-2 bg-[#5B3DF5] text-white text-xs font-bold rounded-xl hover:bg-[#4E30E5] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

    </div>
  );
};

export default Services;