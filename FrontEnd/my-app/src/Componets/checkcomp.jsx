import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

export const Checkcom = () => {
  const [iscomp, setIsComp] = useState(null); // null = loading, false = not admin, true = is admin
  const navigate = useNavigate();

  useEffect(() => {
    const checkcomp = async () => {
      try {
        const res = await axios.get('http://localhost:3000/companey/api/v1/isCompaney', {
          withCredentials: true,
        });
       
        if (res.data.isCompaney) {
          setIsComp(true);
        } else {
          
          setIsComp(false);
          navigate('/'); 
        }
      } catch (error) {
        console.error('Admin check failed:', error);
        setIsComp(false);
        navigate('/'); 
      }
    };

    checkcomp();
  }, [navigate]);

  if (iscomp === null) return <p>Loading...</p>;

  return iscomp ? <Outlet /> : null;
};
