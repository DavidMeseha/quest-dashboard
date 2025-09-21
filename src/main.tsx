import './index.css';
import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import ErrorPage from './pages/Error';
import AuthPagesLayout from './layouts/AuthPages';
import LoadingSpinner from './components/ui/loading-spinner';
import LoginPage from './pages/Login';
import RegisterVendorPage from './pages/RegisterVendor';
import PagesWarper from './layouts/PagesWarper';
import RegisterPage from './pages/Register';
import VendorGuard from './layouts/VendorGuard';
import UserGuard from './layouts/UserGuard';
import DashboardLayout from './layouts/Dashboard';
import UserInitRequiredGuard from './layouts/UserInitRequiredGuard';

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    element: <PagesWarper />,
    children: [
      //Public routes
      {
        element: <AuthPagesLayout />,
        children: [
          { path: '/', element: <LoginPage /> },
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> }
        ]
      },

      //Protected Routes (need user initialized)
      {
        element: <UserInitRequiredGuard />,
        children: [
          /** User only protected routes **/
          {
            element: <UserGuard />,
            children: [
              {
                element: <AuthPagesLayout />,
                children: [{ path: '/create-vendor', element: <RegisterVendorPage /> }]
              }
            ]
          },

          /** Vendor only protected routes **/
          {
            element: <VendorGuard />,
            children: [
              {
                element: <DashboardLayout />,
                children: [
                  { path: '/create-product', Component: lazy(() => import('@/pages/CreateProduct')) },
                  { path: '/edit-product/:id', Component: lazy(() => import('@/pages/EditProduct')) },
                  { path: '/products', Component: lazy(() => import('@/pages/Products')) }
                ]
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
