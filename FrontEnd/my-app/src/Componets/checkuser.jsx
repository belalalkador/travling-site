import React, {  useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/Context';

const CheckUser = () => {
  const { user } = useUser()
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return user ? <Outlet /> : null;
};

export default CheckUser;
