import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router';

type Props = {
  item: {
    to?: string;
    name: string;
    icon: React.ReactElement;
  };
  onClick?: () => void;
};

export default function NavItem({ item, onClick }: Props) {
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
