export default function DashboardCard({ icon: Icon, title, value }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
      <div className="p-3 bg-slate-800 rounded-lg">
        <Icon className="w-6 h-6 text-blue-300" />
      </div>
      <div>
        <p className="text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
      </div>
    </div>
  );
}