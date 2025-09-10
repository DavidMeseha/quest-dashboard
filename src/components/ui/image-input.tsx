import { Plus } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function ImageInput(props: Props) {
  return (
    <label
      className="border-primary bg-muted hover:bg-primary-100 flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors"
      htmlFor="image-upload"
    >
      <Plus className="text-primary" size={32} />
      <span className="text-primary mt-2 text-sm">Add Image</span>
      <input accept="image/*" className="hidden" id="image-upload" type="file" {...props} />
    </label>
  );
}
