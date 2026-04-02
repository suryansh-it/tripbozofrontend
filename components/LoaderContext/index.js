"use client";

import React, { createContext, useContext, useState } from 'react';

// Create the context
const LoaderContext = createContext();

// Provider component
export function LoaderProvider({ children }) {
  const [show, setShow] = useState(false);
  
  return (
    <LoaderContext.Provider value={{ show, setShow }}>
      {children}
    </LoaderContext.Provider>
  );
}

// Custom hook for using the context
export function useLoader() {
  const context = useContext(LoaderContext);
  
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  
  return context;
} 