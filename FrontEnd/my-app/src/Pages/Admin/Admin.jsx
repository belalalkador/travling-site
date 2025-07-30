import React, { useEffect, useState } from 'react';
import { Layout } from '../../Layout/Layout';
import axios from 'axios';
import './Admin.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  // Fetch all users
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

  // Delete User
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3000/admin/api/v1/user/${userId}`, {
          withCredentials: true,
        });
        fetchUsers(); // refresh the table
        alert('User deleted.');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  // Toggle Company Status
  const handleToggleCompany = async (userId, makeCompany) => {
    try {
      const endpoint = makeCompany
        ? `http://localhost:3000/admin/api/v1/make-company/${userId}`
        : `http://localhost:3000/admin/api/v1/remove-company/${userId}`;

      await axios.put(endpoint, {}, {
        withCredentials: true,
      });

      fetchUsers(); // refresh the table
      alert(makeCompany ? 'User is now a Company.' : 'Company status removed.');
    } catch (error) {
      console.error('Error updating user company status:', error);
      alert('Failed to update company status.');
    }
  };

  // Filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
  );

  return (
    <Layout>
      <div className="admin-background">
        <div className="admin-glass">
          <h1 className="admin-title">Admin Dashboard</h1>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="admin-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user._id)} className="delete-btn">
                      Delete
                    </button>
                    <label style={{ marginLeft: '10px' }}>
                      <input
                        type="checkbox"
                        checked={user.isCompany}
                        onChange={(e) => handleToggleCompany(user._id, e.target.checked)}
                      />{' '}
                      Is Company
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;
