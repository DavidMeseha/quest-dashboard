import { isAxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import userApi from '@/services/user-api/api';
import adminApi from '@/services/admin-api/api';
import { APP_STATUS_QUERY_KEY } from '@/constants/query-keys';
import { BiSolidErrorCircle } from 'react-icons/bi';
import { Button } from '../ui/button';

export default function NetworkErrorBoundary({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<'You Are Offline' | 'Server Down' | 'Internal Server Error' | null>();

  useEffect(() => {
    const userInterceptor = userApi.interceptors.response.use(
      (res) => res,
      (error) => {
        if (navigator.onLine) {
          if (isAxiosError(error) && error.response) {
            if (error.response.status === 500) setError('Internal Server Error');
          } else {
            setError('Server Down');
          }
        }

        return Promise.reject(error);
      }
    );
    const adminInterceptor = adminApi.interceptors.response.use(
      (res) => res,
      (err) => {
        if (navigator.onLine) {
          if (isAxiosError(err) && err.response) {
            if (err.response.status === 500) setError('Internal Server Error');
          } else {
            setError('Server Down');
          }
        }

        return Promise.reject(error);
      }
    );

    const handleOffline = () => setError('You Are Offline');
    const handleOnline = () => setError(null);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      adminApi.interceptors.response.eject(adminInterceptor);
      userApi.interceptors.response.eject(userInterceptor);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Status check query
  const statusQuery = useQuery({
    queryKey: [APP_STATUS_QUERY_KEY],
    queryFn: async () =>
      userApi
        .get('/api/status')
        .then(() => {
          queryClient.invalidateQueries({ predicate: (q) => !q.queryKey.includes(APP_STATUS_QUERY_KEY) });
          setError(null);
          return true;
        })
        .catch(() => {
          return false;
        }),
    enabled: error === 'Server Down' || error === 'Internal Server Error',
    refetchInterval: (data) => (data ? false : 1000),
    retry: 3
  });

  const check = () => {
    if ((error === 'You Are Offline' && navigator.onLine) || error === 'Server Down') statusQuery.refetch();
    else if (navigator.onLine) setError(null);
  };

  return (
    <>
      {children}
      {error && (
        <div className="text-accent bg-accent-foreground fixed start-4 bottom-4 z-50 flex items-center justify-center gap-2 rounded px-6 py-3 drop-shadow-xl md:start-22">
          <BiSolidErrorCircle className="text-destructive" size={20} />
          {error}
          <Button variant="secondary" className="ms-4 h-7 px-2" onClick={check}>
            Retry
          </Button>
        </div>
      )}
    </>
  );
}
