import type { InputHTMLAttributes } from 'react';
import { Input } from './input';
import ErrorMessage from './error-message';
import { cn } from '@/lib/utils';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string | null;
};

export default function FormInput({ className, error, ...props }: Props) {
  return (
    <>
      <Input className={cn(error ? 'border-destructive' : 'border-slate-300', className)} {...props} />
      <ErrorMessage error={error} />
    </>
  );
}
