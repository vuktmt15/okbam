import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  // Tránh SSR để không bị nhân đôi do hydration mismatch
  if (typeof window === 'undefined') return null;

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Get current domain
      const urlPath = window.location.origin;
      
      const response = await fetch(`/api/auth/forgot-password?email=${encodeURIComponent(email)}&urlPath=${encodeURIComponent(urlPath)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.statusCode === 'OK') {
        setSuccess('Password reset email has been sent! Please check your inbox and follow the instructions.');
        setEmail(''); // Clear email field
      } else {
        const message = data?.message || 'Failed to send reset email. Please try again.';
        setError(message);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Forgot Password - DRAGON</title>
      </Head>
      <div className="auth-page dark">
        <div className="dragon-logo">DRAGON</div>
        <div className="auth-container dark">
          <div className="auth-form dark">
            <h1 className="signin-title">Reset Password</h1>
            <p style={{ color: '#ccc', marginBottom: '20px', fontSize: '14px' }}>
              Enter your email address and we'll send you instructions to reset your password.
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
            
            {success && <div className="auth-success" style={{ 
              background: '#162312', 
              border: '1px solid #52c41a', 
              color: '#52c41a', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              fontSize: '14px'
            }}>{success}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-button primary" 
                disabled={isSubmitting || !email.trim()}
                style={{ marginBottom: '16px' }}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Email'}
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
