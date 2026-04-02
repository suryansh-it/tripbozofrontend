"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLoader } from './LoaderContext';

export default function LoaderRouteListener() {
  const pathname = usePathname();
  const { setShow } = useLoader();

  useEffect(() => {
    // Hide loader when navigation completes
    setShow(false);
  }, [pathname, setShow]);

  return null; // This component doesn't render anything
} 