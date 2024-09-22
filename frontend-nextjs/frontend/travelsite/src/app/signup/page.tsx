"use client";
import { useEffect,useState } from "react";
import React from "react";
import axios from "axios";
import {ToastContainer,toast} from "react-toastify";
import Header from "../components/header";
import {useRouter} from "next/navigation";
import './page.css';
import { useAuth } from "../components/Authcontext";
import 'react-toastify/dist/ReactToastify.css';


interface formdata {
  name: string;
  username: string;
  email: string;
  password: string;
  profile_pic: File | null;
}

export default function Signup () {
  const [formData ,setFormData] = useState<formdata>({
    name:"",
    username:"",
    email:"",
    password:"",
    profile_pic: null,
  });
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const {username, password, errorMessage,setUsername,setPassword, setErrorMessage, handleSubmit} = useAuth();


  const handleSubmitt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await toast.promise(
        axios.post("http://localhost:8000/auth/signup/", formData, { withCredentials: true }), 
        {
          pending: "Creating user...",
          success: "User created successfully",
          error: "Failed to create user",
        }
      );
      setMessage(response.data.message);

      if (response.status === 201) {
        setUsername(formData.username);
        setPassword(formData.password);
        
        try {
          handleSubmit(e);
        } catch (message: any) {
          toast.error(message);
        }


      } else {
        setErrorMessage(response.data.message);
      }
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
          <form className= 'form'onSubmit={handleSubmitt}>
            <div className="p-form">
            <p>Enter the following details to continue! </p>
            </div>
            <div className="form-group">
                <div className="name-div">
                  <input type="text" name="name" onChange={handleChange} placeholder="Name" required />
                </div>
                <div className="email-div">
                  <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                </div>
                <div className="username-div">
                  <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                </div>
                <div className="password-div">
                  <input type="assword" placeholder="Password" name="password" onChange={handleChange} required />
                </div>
                <div className="profile_picture-div">
                  <label htmlFor="profile_pic" className="custom-file-upload">
                    Profile Picture
                  </label>
                  <input
                    id="profile_pic"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, profile_pic: e.target.files ? e.target.files[0]: null})}>
                  </input>


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