// src/components/TrailingSlashRedirect.tsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TrailingSlashRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If URL has trailing slash and it's not root
    if (location.pathname !== '/' && location.pathname.endsWith('/')) {
      const newPath = location.pathname.slice(0, -1);
      navigate(newPath + location.search + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default TrailingSlashRedirect;
