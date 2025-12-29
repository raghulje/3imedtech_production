import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div 
      className={`page-enter ${isTransitioning ? '' : 'fade-in'}`}
      style={{
        minHeight: '100vh',
        animation: 'pageEnter 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;

