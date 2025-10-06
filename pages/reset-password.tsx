import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ResetPassword() {
  // Tránh SSR để không bị nhân đôi do hydration mismatch
  if (typeof window === 'undefined') return null;

  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirmation: ''
  });
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get token from URL parameters
  useEffect(() => {
    if (router.query.token) {
      setToken(router.query.token as string);
    }
  }, [router.query.token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validation
    if (!formData.password || !formData.passwordConfirmation) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsSubmitting(false);
      return;
    }

    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.password,
          passwordConfirmation: formData.passwordConfirmation,
          token: token
        }),
      });

      const data = await response.json();

      if (response.ok && data.statusCode === 'OK') {
        // Success - show popup and redirect
        alert('Password changed successfully! Please log in with your new password.');
        router.push('/signin');
      } else {
        const message = data?.message || 'Failed to update password. Please try again.';
        setError(message);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error if no token
  if (!token && router.isReady) {
    return (
      <>
        <Head>
          <title>Reset Password - DRAGON</title>
        </Head>
        <div className="auth-page dark">
          <div className="dragon-logo">DRAGON</div>
          <div className="auth-container dark">
            <div className="auth-form dark">
              <h1 className="signin-title">Invalid Reset Link</h1>
              <p style={{ color: '#ff4d4f', marginBottom: '20px' }}>
                This password reset link is invalid or has expired. Please request a new password reset.
              </p>
              <button 
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="auth-button primary"
              >
                Request New Reset
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Password - DRAGON</title>
      </Head>
      <div className="auth-page dark">
        <div className="dragon-logo">DRAGON</div>
        <div className="auth-container dark">
          <div className="auth-form dark">
            <h1 className="signin-title">Set New Password</h1>
            <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '14px' }}>
              Please enter your new password below.
            </p>
            
            {error && <div className="auth-error" style={{ 
              background: '#2c1810', 
              border: '1px solid #ff4d4f', 
              color: '#ff4d4f', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              fontSize: '14px'
            }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your new password"
                    required
                    disabled={isSubmitting}
                    autoComplete="new-password"
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

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleInputChange}
                    placeholder="Confirm your new password"
                    required
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="auth-button primary" 
                disabled={isSubmitting || !formData.password || !formData.passwordConfirmation}
                style={{ marginBottom: '16px' }}
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>
            
            <div className="auth-footer dark" style={{ marginTop: '20px' }}>
              <p>
                Remember your password?{' '}
                <button 
                  type="button"
                  onClick={() => router.push('/signin')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ffd700', 
                    textDecoration: 'underline', 
                    cursor: 'pointer',
                    fontSize: 'inherit' 
                  }}
                >
                  Back to Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
