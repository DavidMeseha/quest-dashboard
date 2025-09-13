import LoadingSpinner from '@/components/ui/loading-spinner';
import useRefreshTokenQuery from '@/hooks/queries/useRefreshTokenQuery';
import useVerifyTokenQuery from '@/hooks/queries/useVerifyTokenQuery';
import type { IUser } from '@/schemas/types';
import { createContext, useContext, useState, type Dispatch } from 'react';
import { useLocation } from 'react-router';

type Props = {
  children: React.ReactNode;
};

type ContextProvidedValues = { user: IUser | undefined; setUser: Dispatch<React.SetStateAction<IUser | undefined>> };
const userContext = createContext<ContextProvidedValues | undefined>(undefined);

export default function UserProvider({ children }: Props) {
  const [user, setUser] = useState<IUser>();
  const { pathname } = useLocation();

  const verifyQuery = useVerifyTokenQuery({ onSuccess: setUser });

  const isLoadingUser = //To block pages that need user data ready
    verifyQuery.isFetchedAfterMount || pathname.includes('login') || pathname.includes('register') || pathname === '/';

  useRefreshTokenQuery({ enabled: Boolean(user), onFail: () => setUser(undefined) });

  return (
    <userContext.Provider value={{ user, setUser }}>
      {isLoadingUser ? children : <LoadingSpinner className="flex h-screen w-screen items-center justify-center" />}
    </userContext.Provider>
  );
}

export function useUserState() {
  const context = useContext(userContext);
  if (!context) throw new Error('useUserSetup must be used within a UserProvider');
  return context;
}
