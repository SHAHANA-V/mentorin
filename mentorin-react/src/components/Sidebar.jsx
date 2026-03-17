import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/chat', icon: '💬', label: 'Chat' },
    { path: '/analytics', icon: '📊', label: 'Analytics' },
    { path: '/login', icon: '🚪', label: 'Logout' }
  ];

  return (
    <aside className="sidebar">
      <div className="logo">Mentorin</div>
      
      <div className="profile">
        <img src="https://i.pravatar.cc/120?img=5" className="profile-pic" alt="user" />
        <h4 id="userName">Student</h4>
        <span>Trust Member</span>
      </div>

      <ul className="menu">
        {menuItems.map((item, index) => (
          <li 
            key={index}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <Link to={item.path} className="menu-link">
              {item.icon} {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
