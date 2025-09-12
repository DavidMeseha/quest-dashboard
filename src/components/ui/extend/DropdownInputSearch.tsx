import {
  useEffect,
  useState,
  type ChangeEvent,
  type ComponentType,
  type CSSProperties,
  type Dispatch,
  type SetStateAction
} from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Button } from '../button';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '../input';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-select';
import LoadingSpinner from '../loading-spinner';

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type SelectOption = {
  value: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
};

export function DropdownInputSearch({
  options,
  value = '',
  onValueChange,
  placeholder = 'Select...',
  isDisabled = false,
  isPending = false,
  isAsync = false,
  className,
  onSearchChange,
  initialName,
  ...restProps
}: {
  onValueChange?: (v: string) => void;
  onSearchChange?: (value: string) => void;
  initialName?: string;
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isPending?: boolean;
  isAsync?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [visableOptions, setOptions] = useState<SelectOption[]>(options);
  const [selectedDisplay, setSelectedDisplay] = useState(initialName ?? '');

  const onOptionSelect = (option: string) => {
    setSelectedDisplay(options.find((o) => o.value === option)?.label ?? placeholder);
    setSelectedValue(option);
    onValueChange?.(option);
    setIsPopoverOpen(false);
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (onSearchChange) return onSearchChange(value);

    const newOptions = options.filter((o) => o.label.toLowerCase().includes(value ?? ''));
    setOptions(newOptions);
  };

  useEffect(() => {
    if (isPopoverOpen && value !== selectedValue) setSelectedValue(value);
    else if (!isPopoverOpen) onSearchChange?.('');
  }, [isPopoverOpen]);

  const optionsDisplay = isAsync ? options : visableOptions;

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={isDisabled}
          type="button"
          variant="outline"
          className={cn(
            'flex h-10 w-full items-center justify-between p-1 [&_svg]:pointer-events-auto',
            'hover:bg-transparent hover:text-slate-900',
            isDisabled && '[&_svg]:pointer-events-none',
            className
          )}
          onClick={() => setIsPopoverOpen((prev) => !prev)}
        >
          {selectedValue && selectedDisplay ? (
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-wrap items-center px-2">{selectedDisplay}</div>
              <ChevronDown className="text-muted-foreground mx-1 h-4 cursor-pointer" />
            </div>
          ) : (
            <div className="mx-auto flex w-full items-center justify-between">
              <span className="text-muted-foreground mx-3 text-sm">{placeholder}</span>
              <ChevronDown className="text-muted-foreground mx-1 h-4 cursor-pointer" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn('w-auto p-0', className)}
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
        {...restProps}
      >
        <div className="flex items-center gap-2 ps-2">
          <Search className="text-slate-500" />
          <Input
            className={cn('border-none focus:border-none focus:ring-0')}
            placeholder="find..."
            onChange={onSearch}
          />
        </div>

        <Separator />

        {isPending ? (
          <LoadingSpinner className="py-2" size={24} />
        ) : (
          <ul className="p-2">
            {optionsDisplay.map((option) => (
              <li key={option.value}>
                <Button
                  className="w-full justify-start bg-transparent text-slate-900 hover:bg-slate-100"
                  onClick={() => onOptionSelect(option.value)}
                >
                  {option.label}
                </Button>
              </li>
            ))}

            {options.length < 1 && <span>No Catigories found</span>}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
