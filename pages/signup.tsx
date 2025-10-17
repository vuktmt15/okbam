import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SignUp() {
  const router = useRouter();

  // Tránh SSR để không bị nhân đôi do hydration mismatch
  if (typeof window === 'undefined') return null;

  // Step management: 1 = Email input, 2 = OTP verification, 3 = Registration form
  const [currentStep, setCurrentStep] = useState(1);
  const [verifiedEmail, setVerifiedEmail] = useState('');

  // Step 1: Email input
  const [emailData, setEmailData] = useState({ email: '' });
  const [emailError, setEmailError] = useState('');
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);

  // Step 2: OTP verification
  const [otpData, setOtpData] = useState({ otp: '' });
  const [otpError, setOtpError] = useState('');
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);

  // Step 3: Registration form (existing code)
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

  // Step 1: Send verification email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setIsEmailSubmitting(true);

    try {
      const response = await fetch(`/api/auth/send-verify-email?email=${encodeURIComponent(emailData.email)}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok && data.statusCode === 'OK') {
        setVerifiedEmail(emailData.email);
        setCurrentStep(2);
      } else {
        setEmailError(data.message || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setEmailError('An error occurred. Please try again.');
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setIsOtpSubmitting(true);

    try {
      const response = await fetch(`/api/auth/verify-email?email=${encodeURIComponent(verifiedEmail)}&code=${encodeURIComponent(otpData.otp)}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok && data.statusCode === 'OK') {
        setFormData(prev => ({ ...prev, email: verifiedEmail }));
        setCurrentStep(3);
      } else {
        setOtpError(data.message || 'Invalid OTP code');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setOtpError('An error occurred. Please try again.');
    } finally {
      setIsOtpSubmitting(false);
    }
  };

  // Step 3: Registration form (existing code)

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
            
            {/* Step 1: Email Input */}
            {currentStep === 1 && (
              <>
                <h1 className="welcome-title">Enter Your Email</h1>
                {emailError && <div className="auth-error">{emailError}</div>}
                
                <form onSubmit={handleEmailSubmit}>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={emailData.email}
                      onChange={(e) => setEmailData({email: e.target.value})}
                      placeholder="Enter your email"
                      required
                      disabled={isEmailSubmitting}
                      autoComplete="email"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="auth-button primary"
                    disabled={isEmailSubmitting}
                  >
                    {isEmailSubmitting ? 'Sending...' : 'Send Verification Code'}
                  </button>
                </form>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <>
                <h1 className="welcome-title">Enter Verification Code</h1>
                <p style={{color: '#888', marginBottom: '20px', textAlign: 'center'}}>
                  We've sent a verification code to {verifiedEmail}
                </p>
                {otpError && <div className="auth-error">{otpError}</div>}
                
                <form onSubmit={handleOtpSubmit}>
                  <div className="form-group">
                    <label>Verification Code</label>
                    <input
                      type="text"
                      value={otpData.otp}
                      onChange={(e) => setOtpData({otp: e.target.value})}
                      placeholder="Enter 6-digit code"
                      required
                      disabled={isOtpSubmitting}
                      maxLength={6}
                      style={{textAlign: 'center', fontSize: '18px', letterSpacing: '2px'}}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="auth-button primary"
                    disabled={isOtpSubmitting}
                  >
                    {isOtpSubmitting ? 'Verifying...' : 'Verify Code'}
                  </button>
                </form>
                
                <div style={{textAlign: 'center', marginTop: '20px'}}>
                  <p>
                    <a href="#" onClick={(e) => {e.preventDefault(); setCurrentStep(1);}} style={{color: '#007bff'}}>
                      ← Back to Email
                    </a>
                  </p>
                  <p>
                    Didn't receive code? 
                    <a href="#" onClick={(e) => {e.preventDefault(); handleEmailSubmit(e as any);}} style={{color: '#007bff', marginLeft: '5px'}}>
                      Resend
                    </a>
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Registration Form */}
            {currentStep === 3 && (
              <>
                <h1 className="welcome-title">Complete Registration</h1>
                
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
                      disabled={true} // Email is pre-filled and cannot be changed
                      autoComplete="email"
                      style={{backgroundColor: '#f5f5f5', color: '#666'}}
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
              </>
            )}

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
