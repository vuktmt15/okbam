import DashboardLayout from "../components/Layout/DashboardLayout";
import Config from "../config";
import RouteList, {IRoute} from "./RouteList";
import ApiUser from "@app/api/ApiUser";
import LoginComponent from "@app/pages/login";
import {AppProps} from "next/app";
import {useRouter} from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Routes({
  Component,
  pageProps,
  router,
}: AppProps): JSX.Element | null {
  const routerNext = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const currentPath = routerNext.pathname;

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f0f0f',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  // Handle root path redirect
  useEffect(() => {
    if (!isLoading && currentPath === '/') {
      if (!isAuthenticated) {
        router.push('/signin');
      } else if (user?.role.name === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/home');
      }
    }
  }, [isLoading, isAuthenticated, user, currentPath, router]);

  // Public pages (signin, signup, forgot-password, reset-password)
  if (currentPath === '/signin' || currentPath === '/signup' || currentPath === '/forgot-password' || currentPath === '/reset-password') {
    return <Component {...pageProps} />;
  }

  // Admin page - only for admin users
  if (currentPath === '/admin') {
    if (!isAuthenticated) {
      router.push('/signin');
      return null;
    }
    if (user?.role.name !== 'ADMIN') {
      router.push('/home');
      return null;
    }
    return <Component {...pageProps} />;
  }

  // Login page (legacy)
  if (currentPath === Config.PATHNAME.LOGIN) {
    return <LoginComponent />;
  }

  // Root path - show loading while redirecting
  if (currentPath === '/') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0f0f0f',
        color: '#fff'
      }}>
        Redirecting...
      </div>
    );
  }

  // Protected pages - require authentication
  if (!isAuthenticated) {
    router.push('/signin');
    return null;
  }

  // User pages - only for regular users
  if (['/home', '/bam', '/invite', '/my'].includes(currentPath)) {
    if (user?.role.name === 'USER') {
      return (
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      );
    } else if (user?.role.name === 'ADMIN') {
      router.push('/admin');
      return null;
    }
  }

  // Fallback - show component with layout
  return (
    <DashboardLayout>
      <Component {...pageProps} />
    </DashboardLayout>
  );
}
