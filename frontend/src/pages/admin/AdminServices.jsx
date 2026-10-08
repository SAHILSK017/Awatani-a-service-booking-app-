import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Tag,
  AlignLeft,
  IndianRupee,
  LayoutList,
  Loader2,
  Info,
  Activity,
  Trash2,
  Search,
} from 'lucide-react';
import { addCategory, addService, getCategories, getServices, deleteService } from '../../services/categoryService';
import { formatPrice, cn } from '../../utils/helpers';
import { AdminToast } from '../../components/admin/AdminToast';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminModal } from '../../components/admin/AdminModal';
import { Tooltip } from '../../components/admin/Tooltip';

const fieldClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#111827] font-medium placeholder:text-[#94A3B8] focus:border-[#5B3DF5] focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/15 transition-shadow';

const AdminServices = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('🧹');
  const [servName, setServName] = useState('');
  const [servDesc, setServDesc] = useState('');
  const [servPrice, setServPrice] = useState('');
  const [servCategory, setServCategory] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirmService, setDeleteConfirmService] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const [catsData, servsData] = await Promise.all([getCategories(), getServices()]);
      setCategories(catsData);
      setServices(servsData);
      if (catsData.length > 0 && !servCategory) setServCategory(catsData[0]._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await addCategory({ name: catName, icon: catIcon });
      setCatName('');
      showToast('Category added successfully!', 'success');
      fetchContent();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add category', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await addService({
        name: servName,
        description: servDesc,
        price: Number(servPrice),
        category: servCategory,
      });
      setServName('');
      setServDesc('');
      setServPrice('');
      showToast('Service added successfully!', 'success');
      fetchContent();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add service', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    setFormLoading(true);
    try {
      await deleteService(id);
      setDeleteConfirmService(null);
      showToast('Service deleted successfully!', 'success');
      fetchContent();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete service', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && categories.length === 0) {
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
        badge="Catalog"
        icon={Activity}
        title="Services"
        description="Configure categories and publish services available on the platform."
      />

      {/* Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden"
        >
          <div className="px-5 sm:px-6 py-4 border-b border-[#E2E8F0]">
            <h3 className="text-base font-semibold text-[#111827] flex items-center gap-2">
              <Tag size={16} className="text-[#5B3DF5]" />
              Add Category
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">Group services under a shared category</p>
          </div>
          <form onSubmit={handleAddCategory} className="p-5 sm:p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#64748B]">Category name</label>
              <div className="relative">
                <LayoutList size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  required
                  placeholder="e.g. Home Cleaning"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className={cn(fieldClass, 'pl-10')}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#64748B]">Icon / emoji</label>
              <div className="relative">
                <Info size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  required
                  placeholder="🧹"
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  className={cn(fieldClass, 'pl-10')}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={formLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#5B3DF5] hover:bg-[#4C2FE0] text-white text-sm font-semibold transition-colors disabled:opacity-50 active:scale-[0.98]"
            >
              {formLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <>
                  <PlusCircle size={16} /> Add Category
                </>
              )}
            </button>
          </form>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden"
        >
          <div className="px-5 sm:px-6 py-4 border-b border-[#E2E8F0]">
            <h3 className="text-base font-semibold text-[#111827] flex items-center gap-2">
              <PlusCircle size={16} className="text-[#5B3DF5]" />
              Add Service
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">Publish a bookable service offering</p>
          </div>
          <form onSubmit={handleAddService} className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#64748B]">Service name</label>
                <div className="relative">
                  <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    required
                    placeholder="Standard Cleaning"
                    value={servName}
                    onChange={(e) => setServName(e.target.value)}
                    className={cn(fieldClass, 'pl-10')}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#64748B]">Base price (₹)</label>
                <div className="relative">
                  <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    required
                    type="number"
                    placeholder="500"
                    value={servPrice}
                    onChange={(e) => setServPrice(e.target.value)}
                    className={cn(fieldClass, 'pl-10')}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#64748B]">Category</label>
              <select
                className={fieldClass}
                value={servCategory}
                onChange={(e) => setServCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#64748B]">Description</label>
              <div className="relative">
                <AlignLeft size={15} className="absolute left-3.5 top-3 text-[#94A3B8]" />
                <textarea
                  required
                  rows={2}
                  placeholder="What this service includes..."
                  value={servDesc}
                  onChange={(e) => setServDesc(e.target.value)}
                  className={cn(fieldClass, 'pl-10 resize-none')}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={formLoading || categories.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-white text-sm font-semibold transition-colors disabled:opacity-50 active:scale-[0.98]"
            >
              {formLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <>
                  <PlusCircle size={16} /> Publish Service
                </>
              )}
            </button>
          </form>
        </motion.section>
      </div>

      {/* Services list */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden"
      >
        <div className="px-5 sm:px-6 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#111827]">Active Services</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              {filteredServices.length} of {services.length} services
            </p>
          </div>
          <div className="flex items-center gap-2.5 h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] max-w-xs w-full">
            <Search size={15} className="text-[#94A3B8] shrink-0" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm font-medium text-[#1E293B] placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]/80">
                {['Service', 'Category', 'Price', 'Action'].map((h) => (
                  <th
                    key={h}
                    className={cn(
                      'px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]',
                      h === 'Action' && 'text-right'
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service, idx) => (
                <motion.tr
                  key={service._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                  className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors duration-150"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-[#111827]">{service.name}</p>
                    <p className="text-xs text-[#64748B] mt-0.5 max-w-md truncate">
                      {service.description}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
                      <span>{service.category?.icon}</span>
                      {service.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-[#111827]">
                      {formatPrice(service.price)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Tooltip content="Delete service">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmService(service)}
                        className="p-2 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Tooltip>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredServices.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-medium text-[#111827]">No services found</p>
            <p className="text-xs text-[#64748B] mt-1">
              {services.length === 0
                ? 'Create a category, then publish your first service.'
                : 'Try a different search query.'}
            </p>
          </div>
        )}
      </motion.section>

      <AdminModal
        open={!!deleteConfirmService}
        onClose={() => setDeleteConfirmService(null)}
        title="Delete Service"
        maxWidth="max-w-md"
      >
        {deleteConfirmService && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="h-12 w-12 bg-rose-50 text-[#EF4444] rounded-xl flex items-center justify-center mx-auto border border-rose-100">
              <Trash2 size={22} />
            </div>
            <p className="text-sm text-[#64748B] text-center leading-relaxed">
              Permanently delete{' '}
              <strong className="text-[#111827] font-semibold">{deleteConfirmService.name}</strong>?
              Customers will no longer be able to book this service.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmService(null)}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteService(deleteConfirmService._id)}
                disabled={formLoading}
                className="flex-1 py-2.5 bg-[#EF4444] hover:bg-red-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center transition-colors disabled:opacity-50"
              >
                {formLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default AdminServices;
