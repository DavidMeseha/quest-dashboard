import './index.css';
import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import ErrorPage from './pages/Error';
import UserProvider from './context/UserProvider';
import AuthPagesLayout from './layouts/AuthPagesLayout';
import VendorProtect from './components/Utils/VendorProtect';
import UserProtect from './components/Utils/UserProtect';
import AppPagesLayout from './layouts/AppPagesLayout';
import LoadingSpinner from './components/ui/loading-spinner';
import NetworkErrorBoundary from './components/Utils/NetworkErrorBoundary';
import LoginPage from './pages/Login';
import RegisterVendorPage from './pages/RegisterVendor';

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        Component: VendorProtect,
        children: [
          {
            Component: AppPagesLayout,
            children: [
              {
                path: '/create-product',
                Component: lazy(() => import('@/pages/CreateProduct'))
              },
              {
                path: '/edit-product/:id',
                Component: lazy(() => import('@/pages/EditProduct'))
              },
              {
                path: '/products',
                Component: lazy(() => import('@/pages/Products'))
              }
            ]
          }
        ]
      },
      {
        Component: AuthPagesLayout,
        children: [
          {
            path: '/',
            Component: LoginPage
          },
          {
            path: '/login',
            Component: LoginPage
          },
          {
            path: '/register',
            Component: lazy(() => import('@/pages/Register'))
          },
          {
            Component: UserProtect,
            children: [
              {
                path: '/vendor',
                Component: RegisterVendorPage
              }
            ]
          }
        ]
      }
    ]
  }
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000, //5 minutes
      gcTime: 600_000 //10 minutes
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NetworkErrorBoundary>
        <UserProvider>
          <Suspense fallback={<LoadingSpinner className="h-screen w-screen" />}>
            <RouterProvider router={router} />
          </Suspense>
        </UserProvider>
      </NetworkErrorBoundary>
    </QueryClientProvider>
    <ToastContainer position="top-right" />
  </StrictMode>
);
