import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import DashboardCard from '../components/custom/DashboardCard';
import { BookOpen, BarChart, Zap } from 'lucide-react';
import WeeklyChart from '../components/custom/WeeklyChart';
import SkillPieChart from '../components/custom/SkillPieChart';
import { Loader2 } from 'lucide-react';

const fetchDashboardSummary = async () => {
  const { data } = await api.get('/dashboard/summary?period=weekly');
  return data;
};

export default function DashboardPage() {
  const { data: summary, isLoading, isError } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: fetchDashboardSummary,
  });

  if (isLoading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-300" /></div>;
  if (isError) return <div>Error loading dashboard data.</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard icon={BookOpen} title="Time Today" value={`${summary.totalMinutesToday} min`} />
        <DashboardCard icon={BarChart} title="This Week" value={`${summary.totalMinutesThisWeek} min`} />
        <DashboardCard icon={Zap} title="Current Streak" value={`${summary.currentStreak} days`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Progress (Minutes)</h2>
          <WeeklyChart data={summary.weeklyChartData} />
        </div>
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Skill Distribution</h2>
          <SkillPieChart data={summary.skillPieChartData} />
        </div>
      </div>
    </div>
  );
}