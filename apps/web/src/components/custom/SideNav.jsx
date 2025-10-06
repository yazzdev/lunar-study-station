import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookText, Bot, Settings, Rocket } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

const navItems = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Logs', href: '/app/logs', icon: BookText },
  { name: 'Grammar AI', href: '/app/grammar-checker', icon: Bot },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export default function SideNav() {
  const { user } = useAuthStore();
  return (
    <nav className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col p-4">
      <div className="flex items-center gap-3 p-4 mb-8">
        <Rocket className="w-8 h-8 text-blue-300" />
        <span className="text-xl font-bold">Lunar Station</span>
      </div>
      <ul className="flex-1 space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive
                  ? 'bg-slate-800 text-blue-300'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="mt-auto p-4 border-t border-slate-800">
        <p className="text-sm font-medium text-slate-200">{user?.name || user?.email}</p>
        <p className="text-xs text-slate-500">Welcome</p>
      </div>
    </nav>
  );
}