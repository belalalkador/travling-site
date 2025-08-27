import React, { useEffect, useState } from 'react';
import { Layout } from '../../Layout/Layout';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/api/v1/users', {
        withCredentials: true,
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3000/admin/api/v1/user/${userId}`, {
          withCredentials: true,
        });
        fetchUsers();
        alert('User deleted.');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  const handleToggleCompany = async (userId, makeCompany) => {
    try {
      const endpoint = makeCompany
        ? `http://localhost:3000/admin/api/v1/make-company/${userId}`
        : `http://localhost:3000/admin/api/v1/remove-company/${userId}`;

      await axios.put(endpoint, {}, { withCredentials: true });
      fetchUsers();
      alert(makeCompany ? 'User is now a Company.' : 'Company status removed.');
    } catch (error) {
      console.error('Error updating user company status:', error);
      alert('Failed to update company status.');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
  );

  return (
    <Layout>
      <div
        className="flex items-center justify-center  px-4 py-5 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] min-h-screen"
          >
        <div className="w-full max-w-6xl p-6 text-white sm:p-8 bg-white/20 backdrop-blur-md rounded-xl">
          <h1 className="mb-6 text-2xl font-bold text-center sm:text-3xl">Admin Dashboard</h1>

          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="w-full p-3 mb-6 text-black placeholder-gray-500 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm sm:text-base">
              <thead>
                <tr className="text-left text-white bg-white/30">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-white/30 hover:bg-white/10">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-3 py-1 text-white bg-red-500 rounded-md mrtext-xs mr hover:bg-red-600 sm:text-sm "
                      >
                        Delete
                      </button>
                      <label className="inline-flex items-center gap-1 text-xs sm:text-sm">
                        <input
                          type="checkbox"
                          checked={user.isCompany}
                          onChange={(e) => handleToggleCompany(user._id, e.target.checked)}
                          className="accent-green-500"
                        />
                        <span>Is Company</span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
