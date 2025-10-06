import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuthStore } from '../../stores/useAuthStore';

const registerSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const loginSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function AuthForm({ isLogin = false }) {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const schema = isLogin ? loginSchema : registerSchema;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (credentials) => {
      const url = isLogin ? '/auth/login' : '/auth/register';
      return api.post(url, credentials);
    },
    onSuccess: (response) => {
      setUser(response.data);
      navigate('/app/dashboard');
    },
    onError: (error) => {
      // Basic error handling
      console.error("Auth error:", error.response?.data?.error || error.message);
      alert(error.response?.data?.error || 'An unexpected error occurred.');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-100">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-slate-400">
            {isLogin ? 'Log in to continue your journey.' : 'Start your journey at the Lunar Station.'}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-300">Name</label>
              <input {...register('name')} className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-blue-300 focus:border-blue-300" />
              <p className="text-red-400 text-sm mt-1">{errors.name?.message}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input {...register('email')} type="email" className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-blue-300 focus:border-blue-300" />
            <p className="text-red-400 text-sm mt-1">{errors.email?.message}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input {...register('password')} type="password" className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-blue-300 focus:border-blue-300" />
            <p className="text-red-400 text-sm mt-1">{errors.password?.message}</p>
          </div>
          <button type="submit" disabled={mutation.isPending} className="w-full py-2 px-4 bg-blue-300 text-slate-950 font-semibold rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50">
            {mutation.isPending ? 'Processing...' : (isLogin ? 'Log In' : 'Register')}
          </button>
        </form>
        <p className="text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? '/register' : '/login'} className="font-medium text-blue-300 hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </p>
      </div>
    </div>
  );
}