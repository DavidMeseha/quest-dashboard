import LoadingSpinner from '@/components/ui/loading-spinner';
import { useUserState } from '@/context/UserProvider';
import { Outlet } from 'react-router';

export default function UserInitRequiredGuard() {
  const { isInit } = useUserState();
  if (isInit) return <Outlet />;
  return <LoadingSpinner className="fixed inset-0" />;
}
