import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import BrandLogo from '../Images/brand-logo-2.png'

export const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleApi = () => {
    const url = 'http://localhost:5000/login';
    const data = { username, password };
    axios.post(url, data)
      .then((res) => {
        if (res.data.message) {
          alert(res.data.message);
          if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('username', res.data.username);
            navigate('/');
          }
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
      <div className="login-form">
        
        <div className="sign-up-form">
          <h1>Login</h1>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>USERNAME</label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>PASSWORD</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={handleApi}>LOGIN</button>
          </form>
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
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
