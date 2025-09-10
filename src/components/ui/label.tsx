import { cn } from '@/lib/utils';
import type { LabelHTMLAttributes } from 'react';

type Props = LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ children, className, ...props }: Props) {
  return (
    <label className={cn('mt-2 mb-0.5 inline-block', className)} {...props}>
      {children}
    </label>
  );
}
