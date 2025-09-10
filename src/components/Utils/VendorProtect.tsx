import { useUserState } from '@/context/UserProvider';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

export default function VendorProtect() {
  const { user } = useUserState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
    if (user && !user.isVendor) navigate('/vendor');
  }, [user]);

  if (!user || !user.isVendor) return <></>;
  return <Outlet />;
}
