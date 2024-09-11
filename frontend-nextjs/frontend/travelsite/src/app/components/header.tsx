'use client';
import React from "react";
import './header.css';
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "./Authcontext";



const Header: React.FC = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const {clearTimer} = useAuth();


  const logout = async () => {
    const token = localStorage.getItem('refreshtoken');
    if (token ) {
      try {
        await axios.post('http://127.0.0.1:8000/auth/signout/',
          { token }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true
        });

        clearTimer();
        localStorage.clear();
        setErrorMessage('');
        router.push('/signin');
      } catch (error: any) {
        setErrorMessage(error.message);
        console.error(error);
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
          <button className="logout-button" onClick={logout}>SIGNOUT</button>
        </div>
      </div>
    </header>
  );
};

export default Header;