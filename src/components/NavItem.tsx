import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router';

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

  return (
    <li
      className={cn(
        'group my-4 flex h-8 w-full items-center overflow-hidden rounded p-1',
        'outline outline-transparent transition-all duration-300 hover:bg-gray-100 hover:outline-gray-200 md:bg-white',
        location.pathname === item.to && 'bg-gray-100 outline-gray-200',
        'hover:w-44'
      )}
    >
      {item.to ? (
        <Link to={item.to} className="inline-flex w-full items-center gap-4">
          <i className="-mb-0.5 min-w-[1.8rem]">{item.icon}</i>
          <p className="w-auto text-nowrap opacity-100 transition-all duration-300 [data-open='false']:w-0 [data-open='false']:opacity-0">
            {item.name}
          </p>
        </Link>
      ) : (
        <button className="inline-flex w-full cursor-pointer items-center gap-4" onClick={onClick}>
          <i className="-mb-0.5 min-w-[1.8rem]">{item.icon}</i>
          <p className="w-auto text-nowrap opacity-100 transition-all duration-300 [data-open='false']:w-0 [data-open='false']:opacity-0">
            {item.name}
          </p>
        </button>
      )}
    </li>
  );
}
