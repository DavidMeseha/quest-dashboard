import { useUserState } from '@/context/UserProvider';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

export default function UserProtect() {
  const { user } = useUserState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
    if (user?.isVendor) navigate('/products');
  }, []);

  if (!user) return <></>;
  return <Outlet />;
}
