import { REFRESH_QUERY_KEY } from '@/constants/query-keys';
import { removeToken, setToken } from '@/lib/localstorage';
import { refreshToken } from '@/services/user-api/auth';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

type Props = {
  onSuccess?: (token: string) => void;
  onFail?: () => void;
  enabled?: boolean;
};

export default function useRefreshTokenQuery({ enabled, onFail, onSuccess }: Props) {
  const navigate = useNavigate();

  return useQuery({
    queryKey: [REFRESH_QUERY_KEY],
    queryFn: () =>
      refreshToken()
        .then((data) => {
          setToken(data.token);
          onSuccess?.(data.token);
          return null;
        })
        .catch(() => {
          navigate('/login');
          removeToken();
          toast.warn('Session Expired, Login to continue!');
          onFail?.();
        }),

    enabled,
    refetchInterval: 1_680_000,
    retry: false
  });
}
