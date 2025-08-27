import { Layout } from '../../Layout/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../Context/Context';

function Profile() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();


  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? 😥')) {
      try {
        const response = await axios.delete('http://localhost:3000/user/api/v1/delete', {
          withCredentials: true,
        });
        if (response.status === 200) {
          alert('Account deleted successfully.');
          setUser(null);
          navigate('/');
        } else {
          alert('Failed to delete account.');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Something went wrong.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/user/api/v1/logout', {}, {
        withCredentials: true,
      });
      if (response.status === 200) {
        alert('Logged out successfully.');
        setUser(null);
        navigate('/login');
      } else {
        alert('Failed to log out.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center h-screen px-4 py-8 bg-gradient-to-br from-cyan-700 via-cyan-800 to-cyan-900">
        <div className="w-full max-w-2xl p-6 text-white shadow-xl bg-white/10 backdrop-blur-lg rounded-2xl sm:p-10">
          <h1 className="mb-6 text-2xl font-bold text-center sm:text-3xl">Hello, {user?.name} 👋</h1>

          <div className="space-y-2 text-sm text-center sm:text-base">
            <p><span className="font-semibold text-cyan-300">Email:</span> {user?.email}</p>
            <p><span className="font-semibold text-cyan-300">Phone:</span> {user?.phone}</p>
            <p><span className="font-semibold text-cyan-300">Birthday:</span> {user?.birthday}</p>
            <p><span className="font-semibold text-cyan-300">Sex:</span> {user?.sex}</p>
          </div>

          <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-center">
   
            <button
              onClick={handleLogout}
              className="px-5 py-2 text-sm text-white transition bg-blue-500 rounded-md hover:bg-blue-600 sm:text-base"
            >
              Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="px-5 py-2 text-sm text-white transition bg-red-500 rounded-md hover:bg-red-600 sm:text-base"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
