import { cn } from '@/lib/utils';
import React from 'react';
import { CgSpinner } from 'react-icons/cg';

type Props = React.ComponentPropsWithoutRef<'div'> & {
  size?: number;
};

export default React.forwardRef<HTMLInputElement, Props>(function LoadingSpinner(
  { className, size = 35, ...props }: Props,
  ref
) {
  return (
    <div
      className={cn('fill-primary flex w-full flex-col items-center justify-center py-2', className)}
      ref={ref}
      role="status"
      {...props}
    >
      <CgSpinner size={size} className="spinner" />
    </div>
  );
});
