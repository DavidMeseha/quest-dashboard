import { sideNav } from '@/constants/menus';
import { BiShoppingBag } from 'react-icons/bi';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { LogOut, MenuIcon, X } from 'lucide-react';
import { Button } from './ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '@/services/user-api/auth';
import { useUserState } from '@/context/UserProvider';
import { removeToken } from '@/lib/token';
import { useLocation, useNavigate } from 'react-router';
import useOutsideClick from '@/hooks/useOutsideClick';

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

  useOutsideClick({ containerRef: asideRef, onOutsideClick: () => setOpen(false) });

  return (
    <>
      <aside
        ref={asideRef}
        className={cn(
          'bg-accent md:bg-card fixed -start-full top-0 z-50 flex h-[100dvh] flex-col justify-between border p-4 shadow transition-all duration-300 md:sticky',
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
            <MenuButton
              isMenuOpen={open}
              onClick={() => setOpen((prev) => !prev)}
              className="bg-accent ms-3 border-none drop-shadow-transparent md:hidden"
            />
          </div>
          <ul>
            {sideNav.map((item) => (
              <NavItem item={item} key={item.to} onClick={() => setOpen(false)} />
            ))}
          </ul>
        </div>
        <div className="pb-4">
          <NavItem item={{ icon: <LogOut size={20} />, name: 'Logout' }} onClick={() => logoutMutation.mutate()} />
          <MenuButton isMenuOpen={open} onClick={() => setOpen((prev) => !prev)} className="hidden md:block" />
        </div>
      </aside>
      <MenuButton
        isMenuOpen={open}
        onClick={() => setOpen((prev) => !prev)}
        className="fixed start-2 top-2 z-40 md:hidden"
      />
    </>
  );
}

type MenuButtonProps = {
  isMenuOpen: boolean;
  onClick: () => void;
  className?: string;
};

function MenuButton({ isMenuOpen, onClick, className }: MenuButtonProps) {
  return (
    <Button variant="outline" onClick={onClick} className={cn('cursor-pointer', className)}>
      {isMenuOpen ? <X size={25} /> : <MenuIcon size={25} />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

type NavItemProps = {
  item: {
    to?: string;
    name: string;
    icon: React.ReactElement;
  };
  onClick?: () => void;
};

function NavItem({ item, onClick }: NavItemProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const clickHandle = (to: string) => {
    navigate(to);
    onClick?.();
  };

  return (
    <li
      className={cn(
        'group my-4 flex h-8 w-full cursor-pointer items-center overflow-hidden rounded p-1 outline outline-transparent',
        'transition-all duration-400 hover:w-44 hover:bg-gray-100 hover:outline-gray-600 md:bg-white',
        location.pathname === item.to && 'bg-gray-100 outline-gray-600'
      )}
    >
      {item.to ? (
        <button
          role="link"
          className="flex w-full cursor-pointer items-center gap-4"
          onClick={() => clickHandle(item.to || '')}
        >
          <i className="ms-0.5 -mb-1">{item.icon}</i>
          <p className="text-nowrap">{item.name}</p>
        </button>
      ) : (
        <button role="link" className="flex w-full cursor-pointer items-center gap-4" onClick={onClick}>
          <i className="ms-0.5 -mb-1">{item.icon}</i>
          <p className="text-nowrap">{item.name}</p>
        </button>
      )}
    </li>
  );
}
