import { BiShoppingBag } from 'react-icons/bi';
import { NavLink } from 'react-router';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};
export default function Logo({ className = '' }: Props) {
  return (
    <NavLink aria-label="to Home Page" className={cn('flex items-center gap-2', className)} to="/">
      <BiShoppingBag size={40} />
      <span className="inline text-2xl font-bold">TechShop</span>
    </NavLink>
  );
}
