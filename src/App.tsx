import { Outlet } from 'react-router';
import NetworkErrorBoundary from './layouts/NetworkErrorBoundary';
import UserProvider from './context/UserProvider';

export default function App() {
  return (
    <NetworkErrorBoundary>
      <UserProvider>
        <Outlet />
      </UserProvider>
    </NetworkErrorBoundary>
  );
}
