import { Button } from '@/components/ui/button';
import { useNavigate, useRouteError } from 'react-router';

export default function ErrorPage() {
  const navigate = useNavigate();
  const error: {
    status: number;
    statusText: string;
    internal: boolean;
    data: string;
    error: object;
  } = useRouteError() as any;

  return (
    <div id="error-page" className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h2 className="text-8xl">{error.status}</h2>
      <div className="flex gap-2 text-4xl">
        <h1>Oops!</h1>
        <p>{error.statusText ?? 'Sorry, an unexpected error has occurred.'}</p>
      </div>
      <Button
        onClick={() => {
          if (error.status === 404) navigate('/');
          else location.reload();
        }}
      >
        {error.status == 404 ? 'Home' : 'Reload'}
      </Button>
    </div>
  );
}
