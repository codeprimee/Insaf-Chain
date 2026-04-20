import { useState, useEffect } from 'react';
import { UserPlus, ToggleLeft, ToggleRight, Trash2, Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/axios-config';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New user form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('stakeholder');
  const [newOrg, setNewOrg] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/admin/users', {
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
        organization: newOrg,
      });

      if (response.data.success) {
        setSuccess('User created successfully.');
        setShowForm(false);
        setNewName(''); setNewEmail(''); setNewPassword(''); setNewRole('stakeholder'); setNewOrg('');
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
    }
  };

  const handleDelete = async (userId, email) => {
    if (!window.confirm(`Delete user ${email}? This cannot be undone.`)) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white">Manage Users</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#1E3A5F] dark:bg-[#0B0F17] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#162d4a] transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Create User Form */}
      {showForm && (
        <form onSubmit={handleCreateUser} className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-[#1F2937] p-5 mb-6">
          <h3 className="font-medium text-[#1E3A5F] dark:text-white mb-4">New User</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Full Name"
              required
              className="border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              required
              className="border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password (min 6 chars)"
              required
              minLength={6}
              className="border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
            >
              <option value="stakeholder">Stakeholder</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="text"
              value={newOrg}
              onChange={(e) => setNewOrg(e.target.value)}
              placeholder="Organization (optional)"
              className="border border-gray-300 dark:border-[#374151] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create User
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-[#111827]/80 dark:backdrop-blur-sm rounded-xl border border-gray-200 dark:border-[#1F2937] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-[#0B0F17] border-b border-gray-200 dark:border-[#1F2937]">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Name</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Email</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Role</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Organization</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Status</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-[#9CA3AF]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400 dark:text-[#6B7280]">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400 dark:text-[#6B7280]">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 dark:border-[#1F2937] hover:bg-gray-50 dark:hover:bg-[#1F2937]">
                    <td className="px-4 py-3 font-medium text-[#1E3A5F] dark:text-white">{user.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-[#9CA3AF]">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 dark:text-[#9CA3AF]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-[#9CA3AF] text-xs">{user.organization || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(user._id)}
                          className="text-slate-400 dark:text-[#6B7280] hover:text-[#1E3A5F] dark:text-white transition"
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive
                            ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                            : <ToggleLeft className="w-5 h-5" />
                          }
                        </button>
                        <button
                          onClick={() => handleDelete(user._id, user.email)}
                          className="text-slate-400 dark:text-[#6B7280] hover:text-red-500 transition"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
