import { Outlet } from 'react-router-dom';
import SideNav from '../custom/SideNav';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <main className="flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}