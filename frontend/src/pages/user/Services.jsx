import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader.jsx';
import { getCategories, getServices } from '../../services/categoryService.js';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Layers, Tag } from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servRes, catRes] = await Promise.all([getServices(), getCategories()]);
        setServices(servRes || []);
        setCategories(catRes || []);
      } catch (error) { console.error('Error fetching:', error); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesCategory = !selectedCategory || service.category?._id === selectedCategory;
    const matchesSearch = (service.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (service.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

  if (loading) return <Loader />;

  return (
    <div className="w-full space-y-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Vibrant Hero Section */}
      <section className="rounded-3xl p-8 md:p-10 border border-violet-400/30 shadow-xl shadow-indigo-500/10 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-10 -bottom-10 w-64 h-64 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Verified Service Providers
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 drop-shadow-sm">
            Explore Services
          </h1>
          <p className="text-indigo-100 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
            Browse our full catalog of professional home repair, installation, and cleaning services.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search for AC repair, plumbing, carpentry..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm font-medium text-slate-900" 
          />
        </div>

        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Layers size={18} />
          </div>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm font-semibold text-slate-700 cursor-pointer appearance-none"
          >
            <option value="">All Categories ({services.length})</option>
            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => {
            const catName = (service.category?.name || '').toLowerCase();
            let theme = { 
              border: 'border-violet-200 hover:border-violet-400', 
              badge: 'bg-violet-50 text-violet-700 border-violet-200', 
              iconBg: 'from-violet-600 to-indigo-600' 
            };
            if (catName.includes('plumb')) theme = { border: 'border-cyan-200 hover:border-cyan-400', badge: 'bg-cyan-50 text-cyan-700 border-cyan-200', iconBg: 'from-cyan-500 to-blue-600' };
            else if (catName.includes('electr')) theme = { border: 'border-amber-200 hover:border-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200', iconBg: 'from-amber-500 to-yellow-500' };
            else if (catName.includes('carpent')) theme = { border: 'border-orange-200 hover:border-orange-400', badge: 'bg-orange-50 text-orange-700 border-orange-200', iconBg: 'from-orange-500 to-amber-600' };
            else if (catName.includes('ac') || catName.includes('repair')) theme = { border: 'border-teal-200 hover:border-teal-400', badge: 'bg-teal-50 text-teal-700 border-teal-200', iconBg: 'from-teal-500 to-emerald-600' };
            else if (catName.includes('clean')) theme = { border: 'border-emerald-200 hover:border-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', iconBg: 'from-emerald-500 to-teal-600' };

            return (
              <motion.div 
                key={service._id} 
                variants={itemVariants} 
                className={`group rounded-2xl bg-white border ${theme.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-1 relative overflow-hidden`}
                onClick={() => navigate('/user/booking', { state: { selectedService: service } })}
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${theme.iconBg}`} />

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${theme.iconBg} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <span className="text-2xl">{service.category?.icon || '📦'}</span>
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
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No services found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Services;