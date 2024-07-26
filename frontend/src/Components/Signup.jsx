import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';
import BrandLogo from '../Images/brand-logo-2.png'

export const Signup = () => {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [mobile, setmobile] = useState('');
  const [email, setemail] = useState('');

  const handleApi = () => {
    const url = 'http://localhost:5000/signup';
    const data = { username, password, mobile, email };
    axios.post(url, data)
      .then((res) => {
        if (res.data.message) {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert('Server Error');
      });
  };

  return (
    <div className='container'>
    <div className="logo">
        <img src={BrandLogo} alt="Logo" /> 
      </div>
    <div className="signup-form">
      
      <div className="sign-up-form">
        <h1>Sign Up</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>USERNAME</label>
          <input type="text" value={username} onChange={(e) => setusername(e.target.value)} />
          
          <label>EMAIL</label>
          <input type="email" value={email} onChange={(e) => setemail(e.target.value)} />
          
          <label>MOBILE</label>
          <input type="text" value={mobile} onChange={(e) => setmobile(e.target.value)} />
          
          <label>PASSWORD</label>
          <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} />
          
          <button type="button" onClick={handleApi}>SIGN UP</button>
        </form>
        <p>By continuing, you agree to our <Link to="#">Terms of Use</Link> and <Link to="#">Privacy Policy</Link>.</p>
        <Link to="/login" className="help-link">Already have an account? Login</Link>
      </div>
      <div className="footer-links">
        <Link to="#">Conditions of Use</Link>
        <Link to="#">Privacy Notice</Link>
        <Link to="#">Help</Link>
      </div>
    </div>
  </div>
  );
};
