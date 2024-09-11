'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProtectedRouter = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accesstoken');
      setIsAuthenticated(!!token);
    
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      setShowRedirectMessage(true);
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === false) {
    return (
      <>
        {showRedirectMessage && (
          <div>
            User is not logged in. Redirecting to sign-in page...
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRouter;