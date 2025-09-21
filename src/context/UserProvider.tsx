import useRefreshTokenQuery from '@/hooks/queries/useRefreshToken';
import useVerifyTokenQuery from '@/hooks/queries/useVerifyToken';
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
  useRefreshTokenQuery({ enabled: Boolean(user), onFail: () => setUser(undefined) });

  return (
    <userContext.Provider value={{ user, setUser, isInit: verifyQuery.isFetchedAfterMount }}>
      {children}
    </userContext.Provider>
  );
}

export function useUserState() {
  const context = useContext(userContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
