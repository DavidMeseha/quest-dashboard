import Logo from '@/components/ui/logo';
import { Outlet } from 'react-router';

export default function AuthPagesLayout() {
  return (
    <main>
      <div className="flex items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-8 rounded-xl border p-8 shadow-lg">
          <Logo className="justify-center" />
          <Outlet />
        </div>
      </div>
    </main>
  );
}
