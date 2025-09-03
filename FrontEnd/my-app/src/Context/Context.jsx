import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/api/v1/me', { withCredentials: true });
        setUser(response.data.user); 

        if (response.data.notifications) {
          setNotifications(response.data.notifications);
        }

      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ⏳ Show loader while fetching
 // ⏳ Show loader while fetching
if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
  );
}

  return (
    <UserContext.Provider value={{ user, setUser, loading, notifications, setNotifications }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use easily
export const useUser = () => useContext(UserContext);
