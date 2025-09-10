import { CgSpinner } from 'react-icons/cg';
import { Button, type ButtonProps } from './button';

type Props = ButtonProps & {
  spinnerSize?: number;
  isLoading?: boolean;
};

export default function SubmitButton({ spinnerSize = 20, isLoading, children, ...props }: Props) {
  return (
    <Button disabled={isLoading} {...props}>
      <div className="relative">
        <span className={isLoading ? 'text-transparent' : ''}>{children}</span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded fill-white text-inherit">
            <CgSpinner size={spinnerSize} className="spinner" />
          </div>
        )}
      </div>
    </Button>
  );
}
