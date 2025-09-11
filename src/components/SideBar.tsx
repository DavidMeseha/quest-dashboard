import { sideNav } from '@/constants/navs';
import { BiShoppingBag } from 'react-icons/bi';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { LogOut, MenuIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import NavItem from './NavItem';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '@/services/user-api/auth';
import { useUserState } from '@/context/UserProvider';
import { removeToken } from '@/lib/localstorage';
import { useNavigate } from 'react-router';
import useClickRecognition from '@/hooks/useClickRecognition';

export default function SideBar() {
  const [open, setOpen] = useState(false);
  const { setUser } = useUserState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const asideRef = useRef(null);

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onMutate: () => {
      setUser(undefined);
      removeToken();
      navigate('/login');
      queryClient.clear();
    }
  });

  useClickRecognition({ containerRef: asideRef, onOutsideClick: () => setOpen(false) });

  return (
    <>
      <aside
        ref={asideRef}
        data-open={open ? 'true' : 'false'}
        className={cn(
          'bg-accent md:bg-card fixed -start-full top-0 z-50 flex h-screen flex-col justify-between border p-4 shadow transition-all duration-300 md:sticky',
          open ? 'start-0 flex w-60 min-w-60' : 'w-[4.3rem] min-w-[4.3rem]'
        )}
      >
        <div>
          <div className="mb-16 flex items-end gap-1 text-2xl font-bold">
            <div className="min-w-10">
              <BiShoppingBag size={35} />
            </div>
            <span className={cn('transition-all duration-300', open ? 'w-auto opacity-100' : 'w-0 opacity-0')}>
              TechShop
            </span>
          </div>
          <ul>
            {sideNav.map((item) => (
              <NavItem item={item} key={item.to} />
            ))}
          </ul>
        </div>
        <div>
          <NavItem item={{ icon: <LogOut size={20} />, name: 'Logout' }} onClick={() => logoutMutation.mutate()} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mb-4 cursor-pointer rounded transition hover:bg-gray-200"
          >
            {open ? <X size={25} /> : <MenuIcon size={25} />}
            <span className="sr-only">Toggle Sidebar</span>
          </button>
        </div>
      </aside>
      <Button
        variant="outline"
        className="fixed start-2 top-2 z-40 hover:bg-gray-200 md:hidden"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </Button>
    </>
  );
}
