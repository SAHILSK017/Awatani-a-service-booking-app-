import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserX,
  Loader2,
  Plus,
  Edit2,
  Eye,
  Mail,
  User,
  Shield,
  Search,
  Lock,
  Users,
} from 'lucide-react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/adminService';
import { formatDate, cn } from '../../utils/helpers';
import { Avatar } from '../../components/admin/Avatar';
import { Tooltip } from '../../components/admin/Tooltip';
import { AdminToast } from '../../components/admin/AdminToast';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminModal } from '../../components/admin/AdminModal';

const fieldClass =
  'w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#111827] font-medium placeholder:text-[#94A3B8] focus:border-[#5B3DF5] focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/15 transition-shadow';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);

  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.filter((u) => u.role === 'user'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await createUser(createForm);
      setIsCreateOpen(false);
      setCreateForm({ name: '', email: '', password: '', role: 'user' });
      showToast('User created successfully!', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create user', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await updateUser(editUser._id, editForm);
      setEditUser(null);
      showToast('User updated successfully!', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setFormLoading(true);
    try {
      await deleteUser(id);
      setDeleteConfirmUser(null);
      showToast('User deleted successfully!', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
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
        badge="Customer Management"
        icon={Users}
        title="Manage Users"
        description="View, create, and manage registered customer accounts."
        action={
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 bg-[#5B3DF5] hover:bg-[#4C2FE0] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <Plus size={16} />
            Add User
          </motion.button>
        }
      />

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 h-10 px-3.5 rounded-xl border border-[#E2E8F0] bg-white shadow-sm max-w-md w-full">
          <Search size={16} className="text-[#94A3B8] shrink-0" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-transparent border-none outline-none text-sm font-medium text-[#1E293B] placeholder:text-[#94A3B8]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-xs text-[#64748B]">
          <span className="font-semibold text-[#111827]">{filteredUsers.length}</span> of {users.length} users
        </p>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden"
      >
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]/80">
                {['User', 'Email', 'Joined', 'Status', 'Action'].map((h) => (
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
              {filteredUsers.map((user, idx) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                  className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors duration-150"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <span className="font-medium text-[#111827]">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B]">{user.email}</td>
                  <td className="px-5 py-3.5 text-[#64748B] text-xs">
                    {formatDate(user.createdAt) || '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <Tooltip content="View details">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-[#5B3DF5] hover:bg-[#EEF2FF] transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Edit user">
                        <button
                          type="button"
                          onClick={() => {
                            setEditUser(user);
                            setEditForm({
                              name: user.name,
                              email: user.email,
                              role: user.role,
                              password: '',
                            });
                          }}
                          className="p-2 rounded-lg text-[#64748B] hover:text-[#F59E0B] hover:bg-amber-50 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete user">
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmUser(user)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-rose-50 transition-colors"
                        >
                          <UserX size={16} />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-[#E2E8F0]">
          {filteredUsers.map((user) => (
            <div key={user._id} className="p-4 flex items-start gap-3">
              <Avatar name={user.name} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#111827] truncate">{user.name}</p>
                <p className="text-xs text-[#64748B] truncate mt-0.5">{user.email}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-[#64748B]">
                  <span className="inline-flex items-center gap-1 text-[#10B981] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Active
                  </span>
                  <span>{formatDate(user.createdAt) || '—'}</span>
                </div>
                <div className="flex gap-1 mt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className="p-2 rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditUser(user);
                      setEditForm({
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        password: '',
                      });
                    }}
                    className="p-2 rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmUser(user)}
                    className="p-2 rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
                  >
                    <UserX size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-medium text-[#111827]">No users found</p>
            <p className="text-xs text-[#64748B] mt-1">Try a different search or add a new user.</p>
          </div>
        )}
      </motion.div>

      {/* CREATE */}
      <AdminModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add New User">
        <form onSubmit={handleCreateUser} className="p-5 sm:p-6 space-y-4">
          {[
            { label: 'Name', icon: User, key: 'name', type: 'text', placeholder: 'John Doe' },
            { label: 'Email', icon: Mail, key: 'email', type: 'email', placeholder: 'john@example.com' },
            { label: 'Password', icon: Lock, key: 'password', type: 'password', placeholder: '••••••••' },
          ].map((f) => (
            <div key={f.key} className="space-y-1.5">
              <label className="text-xs font-medium text-[#64748B]">{f.label}</label>
              <div className="relative flex items-center">
                <f.icon className="absolute left-3.5 text-[#94A3B8]" size={16} />
                <input
                  type={f.type}
                  required
                  placeholder={f.placeholder}
                  value={createForm[f.key]}
                  onChange={(e) => setCreateForm({ ...createForm, [f.key]: e.target.value })}
                  className={fieldClass}
                />
              </div>
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#64748B]">Role</label>
            <div className="relative flex items-center">
              <Shield className="absolute left-3.5 text-[#94A3B8]" size={16} />
              <select
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                className={fieldClass}
              >
                <option value="user">User</option>
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 py-2.5 bg-[#5B3DF5] hover:bg-[#4C2FE0] text-white rounded-xl text-sm font-semibold flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {formLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Create User'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* VIEW */}
      <AdminModal open={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details">
        {selectedUser && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-3">
              <Avatar name={selectedUser.name} size="lg" />
              <div>
                <h4 className="text-lg font-semibold text-[#111827]">{selectedUser.name}</h4>
                <span className="inline-flex mt-1 px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize bg-[#EEF2FF] text-[#5B3DF5] border border-[#E0E7FF]">
                  {selectedUser.role}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-b border-[#E2E8F0] py-4">
              <div>
                <span className="text-[11px] text-[#94A3B8] font-medium block mb-1">Email</span>
                <span className="text-sm font-medium text-[#111827] break-all">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#94A3B8] font-medium block mb-1">Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Active
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#94A3B8] font-medium block mb-1">Joined</span>
                <span className="text-sm font-medium text-[#111827]">
                  {formatDate(selectedUser.createdAt) || '—'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#94A3B8] font-medium block mb-1">User ID</span>
                <span className="text-[11px] font-mono text-[#94A3B8] break-all select-all">
                  {selectedUser._id}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setEditUser(selectedUser);
                  setEditForm({
                    name: selectedUser.name,
                    email: selectedUser.email,
                    role: selectedUser.role,
                    password: '',
                  });
                }}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#1E293B] hover:bg-[#F8FAFC] flex items-center justify-center gap-2 transition-colors"
              >
                <Edit2 size={15} /> Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setDeleteConfirmUser(selectedUser);
                }}
                className="flex-1 py-2.5 border border-rose-200 bg-rose-50 rounded-xl text-sm font-semibold text-[#EF4444] hover:bg-rose-100 flex items-center justify-center gap-2 transition-colors"
              >
                <UserX size={15} /> Delete
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* EDIT */}
      <AdminModal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        <form onSubmit={handleUpdateUser} className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#64748B]">Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 text-[#94A3B8]" size={16} />
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className={fieldClass}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#64748B]">Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-[#94A3B8]" size={16} />
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className={fieldClass}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#64748B]">
              Password <span className="text-[#94A3B8] font-normal">(optional)</span>
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-[#94A3B8]" size={16} />
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                className={fieldClass}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#64748B]">Role</label>
            <div className="relative flex items-center">
              <Shield className="absolute left-3.5 text-[#94A3B8]" size={16} />
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                className={fieldClass}
              >
                <option value="user">User</option>
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditUser(null)}
              className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 py-2.5 bg-[#5B3DF5] hover:bg-[#4C2FE0] text-white rounded-xl text-sm font-semibold flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {formLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* DELETE */}
      <AdminModal
        open={!!deleteConfirmUser}
        onClose={() => setDeleteConfirmUser(null)}
        title="Delete User"
        maxWidth="max-w-md"
      >
        {deleteConfirmUser && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="h-12 w-12 bg-rose-50 text-[#EF4444] rounded-xl flex items-center justify-center mx-auto border border-rose-100">
              <UserX size={22} />
            </div>
            <p className="text-sm text-[#64748B] text-center leading-relaxed">
              Permanently delete{' '}
              <strong className="text-[#111827] font-semibold">{deleteConfirmUser.name}</strong>? This
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(deleteConfirmUser._id)}
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

export default ManageUsers;
