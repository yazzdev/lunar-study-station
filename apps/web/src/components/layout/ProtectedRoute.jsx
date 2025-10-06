import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Loader2 } from 'lucide-react';

async function fetchUser() {
  const { data } = await api.get('/auth/me');
  return data;
}

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated, setUser, logout } = useAuthStore();

  const { data: user, isPending, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false, // Don't retry on auth errors
    enabled: !isAuthenticated, // Only run if not already authenticated from store
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  useEffect(() => {
    if (isError) {
      logout();
      navigate('/login');
    }
  }, [isError, navigate, logout]);


  if (isPending && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-300" />
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  return null; // or a redirect component
}