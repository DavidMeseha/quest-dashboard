import { Outlet } from 'react-router';
import NetworkErrorBoundary from './NetworkErrorBoundary';
import UserProvider from '../context/UserProvider';

export default function PagesWarper() {
  return (
    <NetworkErrorBoundary>
      <UserProvider>
        <Outlet />
      </UserProvider>
    </NetworkErrorBoundary>
  );
}
