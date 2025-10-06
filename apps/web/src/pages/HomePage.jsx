import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <Rocket className="w-24 h-24 text-blue-300 mb-6" />
      <h1 className="text-5xl font-bold mb-4">Welcome to Lunar Study Station</h1>
      <p className="text-xl text-slate-400 max-w-2xl mb-8">
        Your calm, futuristic hub for tracking English language progress. Log your daily efforts, get AI-powered feedback, and watch your skills ascend.
      </p>
      <div className="flex gap-4">
        <Link to="/register" className="px-6 py-3 bg-blue-300 text-slate-950 font-semibold rounded-lg hover:bg-blue-200 transition-colors">
          Begin Your Journey
        </Link>
        <Link to="/login" className="px-6 py-3 bg-slate-800 text-slate-200 font-semibold rounded-lg hover:bg-slate-700 transition-colors">
          Login
        </Link>
      </div>
    </div>
  );
}