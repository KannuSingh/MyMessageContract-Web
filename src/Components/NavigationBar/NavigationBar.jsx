import React from 'react';
import './NavigationBar.css';

function NavigationBar() {
  return (
    <header id="top" className="nav-container">
      <aside className="nav-bar">
        <div className="nav-profile">
          <div className="nav-logo">KS</div>
          <span>Karandeep Singh</span>
        </div>
        <ul className="nav-option-list">
          <li className="nav-item">
            <a className="nav-item-link link-dark" href="#overview">
              Overview
            </a>
          </li>
          {/*<li className="nav-item">
            <a className="nav-item-link link-dark" href="#sports">
              Sports
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-item-link link-dark" href="#contact">
              Contact
            </a>
          </li>
          */}
        </ul>
      </aside>
    </header>
  );
}

export default NavigationBar;
