import useRefreshTokenQuery from '@/hooks/queries/useRefreshToken';
import useVerifyTokenQuery from '@/hooks/queries/useVerifyToken';
import { getToken } from '@/lib/token';
import type { IUser } from '@/schemas/types';
import { createContext, useContext, useState, type Dispatch } from 'react';

type Props = {
  children: React.ReactNode;
};

type ContextProvidedValues = {
  user: IUser | undefined;
  setUser: Dispatch<React.SetStateAction<IUser | undefined>>;
  isInit: boolean;
};
const userContext = createContext<ContextProvidedValues | undefined>(undefined);

export default function UserProvider({ children }: Props) {
  const [user, setUser] = useState<IUser>();

  const verifyQuery = useVerifyTokenQuery({ onSuccess: setUser });
  useRefreshTokenQuery({ enabled: !!user, onFail: () => setUser(undefined) });

  const isInit = verifyQuery.isFetchedAfterMount || (!getToken() && !user) || !!user;
  return <userContext.Provider value={{ user, setUser, isInit }}>{children}</userContext.Provider>;
}

export function useUserState() {
  const context = useContext(userContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
