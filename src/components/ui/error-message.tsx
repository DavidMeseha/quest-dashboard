import { cn } from '@/lib/utils';
import { BiSolidErrorCircle } from 'react-icons/bi';

type Props = { error?: string | null; className?: string };

export default function ErrorMessage({ error, className }: Props) {
  return (
    <p className={cn('text-destructive mt-1 min-h-4 text-sm', className)}>
      {error && (
        <span className="flex items-center gap-1 font-semibold">
          <BiSolidErrorCircle className="inline-block" /> <span>{error}</span>
        </span>
      )}
    </p>
  );
}
