import { useAuthStore } from '../stores/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout: logoutUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      logoutUser();
      navigate('/login');
    }
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-100">Settings</h1>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <div className="space-y-2 mb-6">
          <p><span className="font-medium text-slate-400">Name:</span> {user?.name || 'Not set'}</p>
          <p><span className="font-medium text-slate-400">Email:</span> {user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={mutation.isPending}
          className="w-full px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 font-semibold rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? 'Logging out...' : 'Log Out'}
        </button>
      </div>
    </div>
  );
}