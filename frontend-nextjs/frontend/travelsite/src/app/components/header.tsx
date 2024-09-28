'use client';
import React, { useEffect } from "react";
import './header.css';
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "./Authcontext";
import { toast } from "react-toastify";



const Header: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const {clearTimer} = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('accesstoken');
    setAuthenticated(!!token);

  }, []);

  const logout = async () => {
    if (authenticated === false) {
      router.push('/signin');
      return;
      

    }
    const token = localStorage.getItem('refreshtoken');
    if (token ) {
      try {
        await toast.promise(
          axios.post('http://127.0.0.1:8000/auth/signout/', { token }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            withCredentials: true
          }),
          {
            pending: 'Signing out...',
            success: 'Signed out successfully',
            error: 'Error signing out'
          }
        );

        clearTimer();
        localStorage.clear();
        router.push('/signin');
      } catch (error: any) {
        if(axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.error || 'An error occurred');
      } else {
        toast.error('An error occurred');
      }
    }
  }
  };

  const handleLogoClick = () => {
    router.push('/homepage');
  };

  const handlePClick = () => {
    router.push('/profile');
  };

  return (
    <header>
      <div className="mainn-div">
        <div className="inner-div">
          <img className="logo" onClick={handleLogoClick} src="/logo_av.png" alt="Logo" width={50} height={50} />
          <div className="div-p">
            <p onClick={handlePClick}>Arya Vart</p>
          </div>
          <button className="logout-button" onClick={logout}>{authenticated ? 'Sign out' : 'Login'}</button>
        </div>
      </div>
    </header>
  );
};

export default Header;