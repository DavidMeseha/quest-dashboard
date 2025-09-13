import './index.css';
import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import ErrorPage from './pages/Error';
import AuthPagesLayout from './layouts/AuthPagesLayout';
import AppPagesLayout from './layouts/AppPagesLayout';
import LoadingSpinner from './components/ui/loading-spinner';
import LoginPage from './pages/Login';
import RegisterVendorPage from './pages/RegisterVendor';
import App from './App';
import RegisterPage from './pages/Register';
import VendorGuard from './layouts/VendorGuard';
import UserGuard from './layouts/UserGuard';

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    Component: App,
    children: [
      {
        Component: VendorGuard,
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
            Component: RegisterPage
          },
          {
            Component: UserGuard,
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
      <Suspense fallback={<LoadingSpinner className="fixed h-screen w-screen" />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
    <ToastContainer theme="dark" position="top-right" />
  </StrictMode>
);
