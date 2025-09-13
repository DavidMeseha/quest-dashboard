import LoadingSpinner from '../loading-spinner';
import ErrorMessage from '../error-message';
import type { FieldError } from '@/schemas/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import type { SelectProps } from '@radix-ui/react-select';
import Label from '../label';

export interface FormDropdownInputProps extends SelectProps {
  id: string;
  label: string;
  error?: FieldError;
  options: { name: string; value: string }[];
  isLoading?: boolean;
}

function FormDropdown({ label, error, options, isLoading, id, ...props }: FormDropdownInputProps) {
  return (
    <div className="relative pb-1">
      <Label htmlFor={id}>{label}</Label>
      <Select {...props}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLoading ? <LoadingSpinner size={24} className="fill-gray-300" /> : null}
      <ErrorMessage error={error} />
    </div>
  );
}

export default FormDropdown;
