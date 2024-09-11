'use client';
import React,{useState} from "react";
import Header from "../components/header";
import { useAuth } from "../components/Authcontext";
import './signin.css'

const Signin = () => {
  const { username, password, errorMessage, setUsername, setPassword, handleSubmit } = useAuth();
  return (
    <>
    <Header/>

      <main className="main-div-signin">
      <video className="" autoPlay loop muted>
      <source src="/siginpage.mkv" type="video/webm" />
      Your Browswer doesn't support video tag
      </video>
        <div>
          <div>
            <div>
              <form className="form" onSubmit={handleSubmit}>
                <div className="username-div">
                  <label htmlFor="username"></label>
                  <p>Username</p>
                  <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  />
                </div>
                <div className="password-div">
                  <label htmlFor="password"></label>
                  <p>Password</p>
                  <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  />
                </div>
                  <div className="button-div">
                    <button className="button-signin" type="submit">Sign In</button>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                  </div>
              </form>
            </div>
          </div>
        </div>
      </main> 
    </>
    );
};
export default Signin;
