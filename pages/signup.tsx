import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SignUp() {
  const router = useRouter();

  // Tránh SSR để không bị nhân đôi do hydration mismatch
  if (typeof window === 'undefined') return null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    refererCode: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Prefill referral code from URL: /signup?ref=XXXX or ?refererCode=XXXX
  React.useEffect(() => {
    const ref = (router.query.ref as string) || (router.query.refererCode as string);
    if (ref) {
      setFormData(prev => ({...prev, refererCode: ref}));
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the terms and services');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        password: formData.password,
        email: formData.email,
        phone: formData.phone || undefined,
        appLang: 'vi',
        dateOfBirth: '1995-08-27T00:00:00',
        countryCode: 'VN',
        avatar: 'https://example.com/avatar.jpg',
        gender: 'male',
        refererCode: formData.refererCode || undefined,
      };

                        const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data?.statusCode === 'OK') {
        // Chuyển ngay về trang đăng nhập
        router.replace('/signin');
      } else {
        const message = data?.message || 'Registration failed. Please try again.';
        setError(message);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Head>
        <title>Sign Up - DRAGON</title>
      </Head>
      <div className="auth-page dark">
        <div className="dragon-logo">DRAGON</div>
        <div className="auth-container dark">
          <div className="auth-form dark">
            <h1 className="welcome-title">Welcome to Dragon</h1>
            
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}
            
            <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
                autoComplete="name"
              />
            </div>

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
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone (+84...)"
                disabled={isSubmitting}
                autoComplete="tel"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>
            
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label>Referral Code (optional)</label>
              <input
                type="text"
                name="refererCode"
                value={formData.refererCode}
                onChange={handleInputChange}
                placeholder="Enter referral code (if any)"
                disabled={isSubmitting}
              />
            </div>

            <div className="terms-agreement">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  disabled={isSubmitting}
                />
                <span className="checkbox-text">I agree to the terms and services</span>
              </label>
            </div>
            
            <button type="submit" className="auth-button primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Sign up'}
            </button>
            </form>
          </div>
          
          <div className="auth-footer dark">
            <p>
              Already have an account?{' '}
              <a href="/signin" className="auth-link">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
