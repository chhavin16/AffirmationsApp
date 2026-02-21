import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M3 8.5L11 3L19 8.5V18C19 18.5523 18.5523 19 18 19H4C3.44772 19 3 18.5523 3 18V8.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M8 19V12H14V19" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        </svg>
        <span>Home</span>
      </NavLink>

      <NavLink to="/write" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 16L14 6L16 8L6 18H4V16Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8L14 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <span>Write</span>
      </NavLink>

      <NavLink to="/record" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="8" y="3" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M5 11C5 14.3137 7.68629 17 11 17C14.3137 17 17 14.3137 17 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M11 17V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <span>Record</span>
      </NavLink>

      <NavLink to="/track" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="3" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M7 11L10 14L15 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Track</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;
