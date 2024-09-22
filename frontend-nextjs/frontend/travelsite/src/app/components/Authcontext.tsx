'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface AuthContextProps {
  username: string;
  password: string;
  errorMessage: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setErrorMessage: (errorMessage: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  refreshToken: () => Promise<void>;
  clearTimer: () => void;

}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const refreshToken = async () => {
    try {

      const refreshtoken = localStorage.getItem('refreshtoken');
      const response = await axios.post('http://127.0.0.1:8000/auth/signin/refresh/', {
        refresh: refreshtoken,
      });
      localStorage.setItem('accesstoken', response.data.access);
      setTimer(setTimeout(refreshToken, 2 * 60 * 1000));
    } catch (error) {
      setErrorMessage('Session expired, Login again1');
      router.push('/signin');
    }
  };
  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/signin/', {
        username,
        password,
      });

      localStorage.setItem('accesstoken', response.data.access);
      localStorage.setItem('refreshtoken', response.data.refresh);
      localStorage.setItem('User_id', response.data.id);
      if (response.status === 200){
        setTimer(setTimeout(refreshToken, 2 * 60 * 1000));
        toast.success('Login successful');
        router.push('/profile');
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || 'An error occurred');
      } else {
        toast.error('An error occurred');
      }
    };
  }

 /*useEffect(() => {
    const refreshtoken = localStorage.getItem('refreshtoken');
    if (!refreshtoken && signout===false) {
      console.log('No refresh token found');
      refreshToken();
      
    }
  }, []);*/

  return (
    <AuthContext.Provider
      value={{
        username,
        password,
        errorMessage,
        setUsername,
        setPassword,
        handleSubmit,
        refreshToken,
        clearTimer,
        setErrorMessage,
       
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};