import { useUserState } from '@/context/UserProvider';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

export default function VendorGuard() {
  const { user } = useUserState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!user?.isVendor) {
      navigate('/vendor');
      return;
    }
  }, []);

  if (!user || !user.isVendor) return <></>;
  return <Outlet />;
}
