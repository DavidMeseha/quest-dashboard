import LoadingSpinner from '../loading-spinner';
import ErrorMessage from '../error-message';
import type { FieldError } from '@/schemas/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import type { SelectProps } from '@radix-ui/react-select';

export interface FormDropdownInputProps extends SelectProps {
  id: string;
  error?: FieldError;
  options: { name: string; value: string }[];
  isLoading?: boolean;
}

function FormDropdown({ error, options, isLoading, ...props }: FormDropdownInputProps) {
  return (
    <div className="relative pb-1">
      <Select {...props}>
        <SelectTrigger className="w-full">
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
