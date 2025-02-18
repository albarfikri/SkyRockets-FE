/* eslint-disable react/prop-types */
import { lazy, Suspense } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { configuration } from 'src/constants';
import { DashboardLayout } from 'src/layouts/dashboard';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------
interface PrivateRouteProps {
  children: React.ReactElement;
}

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

const isTokenValid = () => {
  const token = localStorage.getItem(configuration.localStorage);
  if (!token) return false;

  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    const isExpired = decodedToken.exp * 1000 < Date.now();
    return !isExpired;
  } catch (err) {
    console.error("Invalid token:", err);
    return false;
  }
};

// flag replace to prevent going back to the prev
const AuthRoute: React.FC<PrivateRouteProps> = ({ children }) =>
  isTokenValid() ? children : <Navigate to="/" />;

const RedirectIfAuthenticated: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  isTokenValid() ? <Navigate to="/dashboard" /> : <>{children}</>;


export function Router() {

  return useRoutes([
    {
      path: '/',
      element: (
        <RedirectIfAuthenticated>
         <SignInPage />
        </RedirectIfAuthenticated>
      ),
    },
    {
      path: '/dashboard',
      element: (
        <AuthRoute>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </AuthRoute>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: '/products',
      element: (
        <AuthRoute>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <ProductsPage />
            </Suspense>
          </DashboardLayout>
        </AuthRoute>
      ),
    },
    {
      path: '*',
      element: (
        <NotFoundView />
      ),
    },
  ]);
}
