import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from "../components/Layout/DashboardLayout";
import { Home } from "@app/module/home";

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          const userStr = localStorage.getItem('auth_user');
          
          if (token && userStr) {
            try {
              const userData = JSON.parse(userStr);
              setUser(userData);
              setIsAuthenticated(true);
              
              // Nếu là admin thì redirect sang trang admin
              if (userData.role.name === 'ADMIN') {
                window.location.href = '/admin';
                return;
              }
            } catch (error) {
              console.error('Error parsing user data:', error);
              window.location.href = '/signin';
              return;
            }
          } else {
            // Chưa đăng nhập thì redirect sang trang đăng nhập
            window.location.href = '/signin';
            return;
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/signin';
      }
    };

    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, []);

  // Hiển thị loading khi đang check auth
  if (isLoading) {
    return null; // Không hiển thị gì cả, để tránh flash
  }

  // Nếu đã đăng nhập và là user thường thì hiển thị trang home
  if (isAuthenticated && user?.role.name === 'USER') {
    return (
      <DashboardLayout>
        <Home />
      </DashboardLayout>
    );
  }

  // Fallback - không nên đến đây
  return null;
}
