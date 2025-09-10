import { BiSolidErrorCircle } from 'react-icons/bi';

type Props = { error?: string | null };

export default function ErrorMessage({ error }: Props) {
  return (
    <p className="text-destructive mt-1 h-4 text-sm">
      {error && (
        <span className="flex items-center gap-1 font-semibold">
          <BiSolidErrorCircle className="inline-block" /> <span>{error}</span>
        </span>
      )}
    </p>
  );
}
