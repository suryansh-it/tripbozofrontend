"use client";
import React from 'react';
import './Loader.css';

const Loader = ({ show }) => {
  return (
    <div className={`loader-container ${show ? 'show' : ''}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader; 