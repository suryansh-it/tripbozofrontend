"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLoader } from './LoaderContext';

export default function AppLink({ href, children, className, ...rest }) {
  const { setShow } = useLoader();
  const pathname = usePathname();
  const isSameRoute = pathname === href;

  const handleClick = (e) => {
    // Don't show loader if navigating to the same route
    if (!isSameRoute) {
      setShow(true);
    }
    
    // Call any onClick handler passed to the component
    if (rest.onClick) {
      rest.onClick(e);
    }
  };

  return (
    <Link 
      href={href} 
      className={className} 
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  );
}