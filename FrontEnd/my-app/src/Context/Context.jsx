import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [notifications, setNotifications] = useState([]); // ✅ notifications state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/api/v1/me', { withCredentials: true });
        setUser(response.data.user); 

        // If backend also sends notifications with the user, use them:
        if (response.data.notifications) {
          console.log(response.data.notifications)
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

  return (
    <UserContext.Provider value={{ user, setUser, loading, notifications, setNotifications }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use easily
export const useUser = () => useContext(UserContext);
