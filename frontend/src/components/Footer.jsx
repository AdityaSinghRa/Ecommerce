import React from 'react';
import { Phone, Mail, GitHub, LinkedIn, YouTube, Instagram } from '@mui/icons-material';
import '../componentStyles/Footer.css';

function Footer() {
  return (
    <footer className='footer'>

      <div className='footer-container'>

        {/* Section 1: Contact */}
        <div className='footer-section contact'>
          <h3>Contact Us</h3>
          <p><Phone fontSize='small' /> Phone: +919369859674</p>
          <p><Mail fontSize='small' /> Email: singhaditya51330@gmail.com</p>
        </div>

        {/* Section 2: Social */}
        <div className='footer-section social'>
          <h3>Follow Me</h3>
          <div className='social-links'>
            <a href="https://www.github.com/AdityaSinghRa" target="_blank"><GitHub className='social-icon' /></a>
            <a href="https://www.linkedin.com/in/aditya-singh-6a5b30288/" target="_blank"><LinkedIn className='social-icon' /></a>
            <a href="https://www.youtube.com" target="_blank"><YouTube className='social-icon' /></a>
            <a href="https://www.instagram.com" target="_blank"><Instagram className='social-icon' /></a>
          </div>
        </div>

        {/* Section 3: About */}
        <div className='footer-section about'>
          <h3>About</h3>
          <p>
            Providing web development tutorials and courses to help you grow your skills.
          </p>
        </div>

      </div>

      <div className='footer-bottom'>
        <p>&copy; 2025 AdityaCoding. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;
