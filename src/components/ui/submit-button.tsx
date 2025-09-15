import { CgSpinner } from 'react-icons/cg';
import { Button, type ButtonProps } from './button';

type Props = ButtonProps & {
  isLoading?: boolean;
};

export default function SubmitButton({ isLoading, children, ...props }: Props) {
  return (
    <Button disabled={isLoading} {...props}>
      <div className="relative">
        <span className={isLoading ? 'text-transparent' : ''}>{children}</span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded fill-white text-inherit">
            <CgSpinner className="spinner" />
          </div>
        )}
      </div>
    </Button>
  );
}
