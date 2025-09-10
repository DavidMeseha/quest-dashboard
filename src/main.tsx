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
                Component: lazy(() => import('./pages/CreateProduct'))
              },
              {
                path: '/edit-product/:id',
                Component: lazy(() => import('./pages/EditProduct'))
              },
              {
                path: '/products',
                Component: lazy(() => import('./pages/Products'))
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
            Component: lazy(() => import('./pages/Login'))
          },
          {
            path: '/login',
            Component: lazy(() => import('./pages/Login'))
          },
          {
            path: '/register',
            Component: lazy(() => import('./pages/Register'))
          },
          {
            Component: UserProtect,
            children: [
              {
                path: '/vendor',
                Component: lazy(() => import('./pages/RegisterVendor'))
              }
            ]
          }
        ]
      }
    ]
  }
]);

const queryClient = new QueryClient({});

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
