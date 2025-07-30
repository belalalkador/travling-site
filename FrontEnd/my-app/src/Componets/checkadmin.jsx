import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

export const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(null); // null = loading, false = not admin, true = is admin
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get('http://localhost:3000/admin/api/v1/isadmin', {
          withCredentials: true,
        });

        if (res.data.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate('/home'); 
        }
      } catch (error) {
        console.error('Admin check failed:', error);
        setIsAdmin(false);
        navigate('/home'); 
      }
    };

    checkAdmin();
  }, [navigate]);

  if (isAdmin === null) return <p>Loading...</p>;

  return isAdmin ? <Outlet /> : null;
};
