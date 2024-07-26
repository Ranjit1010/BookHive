import React from 'react';
import './Footer.css';
import { FaInstagram } from "react-icons/fa";
import { FaSnapchat } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";


const Footer = () => {
  return (
    <section className="footer">
      <div className="social">
        <a href="#"><FaInstagram/></a>
        <a href="#"><FaSnapchat/></a>
        <a href="#"><FaTwitter/></a>
        <a href="#"><FaFacebookF/></a>
      </div>
      <ul className="list">
        <li><a href="#">Home</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Terms</a></li>
        <li><a href="#">Privacy Policy</a></li>
      </ul>
      <p className="copyright">BookHive @ 2024</p>
    </section>
  );
};

export default Footer;
