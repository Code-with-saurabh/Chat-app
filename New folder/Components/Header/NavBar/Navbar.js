// src/Components/Header/NavBar/Navbar.js
import React from 'react';
import './Navbar.css';  // Navbar specific styles
import Logo from '../HeaderComponents/Logo/Logo';  // Import Logo component
import Search from '../HeaderComponents/Search/Search';  // Import Search component
import Chats from '../HeaderComponents/NavLinks/chats';  // Navigation Links
import Profile from '../HeaderComponents/NavLinks/profile';
import Settings from '../HeaderComponents/NavLinks/settings';
import Notification from '../HeaderComponents/Notification/Notification';  // Notification component

const Navbar = () => {
  return (
    <header className="Header sticky">
      <Logo />
      <Search />
      <div className="navlinks">
        <Chats />
        <Profile />
        <Settings />
      </div>
      <Notification />
    </header>
  );
}

export default Navbar;
