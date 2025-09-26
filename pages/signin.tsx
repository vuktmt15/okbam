import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function SignIn() {
  // Tránh SSR để không bị nhân đôi do hydration mismatch
  if (typeof window === 'undefined') return null;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called!');
    setError('');
    setIsSubmitting(true);

    try {
      console.log('Making API call...');
              const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.statusCode === 'OK') {
        const { user: userData, token: authToken } = data.body;
        console.log('Login successful!');
        
        // Save to localStorage
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        // Redirect based on role
        if (userData.role.name === 'ADMIN') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      } else {
        console.log('Login failed');
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - BAM</title>
      </Head>
      <div className="auth-page dark">
        <div className="dragon-logo">DRAGON</div>
        <div className="auth-container dark">
          <div className="auth-form dark">
            <h1 className="signin-title">Sign In</h1>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting}
                />
                <span className="checkbox-text">Remember account</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            
            <button 
              type="button" 
              className="auth-button primary" 
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          
          </div>
          
          <div className="auth-footer dark">
            <p>
              Don’t have an account?{' '}
              <a href="/signup" className="auth-link">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
