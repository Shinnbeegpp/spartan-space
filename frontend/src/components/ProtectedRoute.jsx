import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { clearAuthSession, getDashboardPath, getStoredToken } from '../auth';

export default function ProtectedRoute({ allowedRole, loginPath, children }) {
  const [token] = useState(getStoredToken);
  const [session, setSession] = useState(() => ({
    status: token ? 'checking' : 'unauthenticated',
    role: null,
  }));

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const controller = new AbortController();

    const verifySession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!response.ok) {
          clearAuthSession();
          setSession({ status: 'unauthenticated', role: null });
          return;
        }

        const data = await response.json();
        setSession({ status: 'authenticated', role: data.userData?.role ?? null });
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSession({ status: 'unavailable', role: null });
        }
      }
    };

    verifySession();
    return () => controller.abort();
  }, [token]);

  if (session.status === 'checking') {
    return <main className="session-status">Checking session...</main>;
  }

  if (session.status === 'unavailable') {
    return <main className="session-status">Unable to verify your session.</main>;
  }

  if (session.status !== 'authenticated') {
    return <Navigate to={loginPath} replace />;
  }

  if (session.role !== allowedRole) {
    return <Navigate to={getDashboardPath(session.role) || loginPath} replace />;
  }

  return children;
}
