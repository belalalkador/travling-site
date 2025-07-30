import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // to store the user data
  const [loading, setLoading] = useState(true); // to show loading when checking

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/api/v1/me', { withCredentials: true });
        setUser(response.data.user); // based on your backend response
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use easily
export const useUser = () => useContext(UserContext);
