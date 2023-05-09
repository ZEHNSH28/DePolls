import React from "react";
import "./Navbarstyle.css";

const Navbar = () => {
  return (
    <>
      <div class="navbar">
        <div class="navbar-title">Crypto Polls</div>
        <ul class="navbar-menu">
          <li className="navbar-item">Home</li>
          <li className="navbar-item">About</li>
          <li className="navbar-item">Contact</li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
