"use client";
import { useEffect,useState } from "react";
import React from "react";
import axios from "axios";
import Header from "../components/header";
import {useRouter} from "next/navigation";
import './page.css';

interface formdata {
  name: string;
  username: string;
  email: string;
  password: string;
}

export default function Signup (){
  const [formData ,setFormData] = useState({
    name:"",
    username:"",
    email:"",
    password:""
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/auth/signup/", formData, { withCredentials: true });
      console.log("User created successfully", response.data);
      router.push("/signin");

    } catch (error) {
      console.error("Failed to create user,",error);
      
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };
  return (
    <>
    <Header/>
    <main>
      <div className="main">
        <div className="glass">
          <form className= 'form'onSubmit={handleSubmit}>
            <div className="p-form">
            <p>Enter the following details to continue! </p>
            </div>
            <div className="form-group">
              <div className="fg-1">
                <div className="name-div">
                  <p>Enter Name</p>
                  <input type="text" name="name" onChange={handleChange} required />
                </div>
                <div className="email-div">
                  <p>Enter Email</p>
                  <input type="email" name="email" onChange={handleChange} required />
                </div>
              </div>
              <div className="fg-2">
                <div className="username-div">
                  <p>Enter Username</p>
                  <input type="text" name="username" onChange={handleChange} required />
                </div>
                <div className="password-div">
                  <p>Enter Password</p>
                  <input type="password" name="password" onChange={handleChange} required />
                </div>
              </div>
              <br />
              <input  className='button-submit'type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>
    </main>
    </>
);
}