"use client";
import React from 'react';
import { useLoader } from './LoaderContext';
import Loader from './Loader';

export default function LoaderConsumerContent({ children }) {
  const { show } = useLoader();
  
  return (
    <>
      <Loader show={show} />
      {children}
    </>
  );
} 