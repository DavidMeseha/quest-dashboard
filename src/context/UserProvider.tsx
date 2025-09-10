import LoadingSpinner from '@/components/ui/loading-spinner';
import { REFRESH_QUERY_KEY, VERIFY_QUERY_KEY } from '@/constants/query-keys';
import { setToken } from '@/lib/localstorage';
import type { IUser } from '@/schemas/types';
import { checkTokenValidity, refreshToken } from '@/services/user-api/auth';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useState, type Dispatch } from 'react';

type Props = {
  children: React.ReactNode;
};

type ContextProvidedValues = { user: IUser | undefined; setUser: Dispatch<React.SetStateAction<IUser | undefined>> };
const userContext = createContext<ContextProvidedValues | undefined>(undefined);

export default function UserProvider({ children }: Props) {
  const [user, setUser] = useState<IUser>();

  const verifyQuery = useQuery({
    queryKey: [VERIFY_QUERY_KEY],
    queryFn: () =>
      checkTokenValidity().then((data) => {
        setUser(data);
        return null;
      }),

    retry: false
  });

  useQuery({
    queryKey: [REFRESH_QUERY_KEY],
    queryFn: () =>
      refreshToken()
        .then((data) => {
          setToken(data.token);
          return null;
        })
        .catch(() => setUser(undefined)),

    enabled: !!user,
    refetchInterval: 1_680_000,
    retry: false
  });

  return (
    <userContext.Provider value={{ user, setUser }}>
      {verifyQuery.isFetchedAfterMount ? (
        children
      ) : (
        <LoadingSpinner className="flex h-screen w-screen items-center justify-center" />
      )}
    </userContext.Provider>
  );
}

export function useUserState() {
  const context = useContext(userContext);
  if (!context) throw new Error('useUserSetup must be used within a UserProvider');
  return context;
}
