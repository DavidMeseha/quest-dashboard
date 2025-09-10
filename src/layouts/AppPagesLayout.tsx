import SideBar from '@/components/SideBar';
import { Outlet } from 'react-router';
export default function AppPagesLayout() {
  return (
    <div className="flex">
      <SideBar />
      <main className="container mt-12 pb-12 md:mt-6">
        <Outlet />
      </main>
    </div>
  );
}
