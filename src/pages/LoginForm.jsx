import axiosInstance from "../api/axiosInstance";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import logo from '../assets/nav-logo.png'

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LoginForm Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Please try refreshing the page</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function LoginForm() {
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginField || !password) {
      setError("Please enter both email/username and password.");
      return;
    }

    // Validate email format if email is provided
    if (loginField.includes('@') && !validateEmail(loginField)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const isEmail = loginField.includes('@');
      const loginData = {
        password,
        ...(isEmail ? { email: loginField } : { username: loginField })
      };

      const response = await axiosInstance.post(
        "/users/login",
        loginData,
        { withCredentials: true }
      );

      // Store tokens and user data in localStorage
      if (response.data?.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }
      if (response.data?.data?.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      if (response.data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      // Store in Redux
      if (response.data?.data?.user && response.data?.data?.accessToken) {
        dispatch(setCredentials({
          user: response.data.data.user,
          token: response.data.data.accessToken
        }));
      }

      // Show success message and start redirect
      toast.success('Login successful!');
      setIsRedirecting(true);
      setTimeout(() => {
        navigate('/feed', { replace: true });
      }, 50);

    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Invalid email/username or password.';
            break;
          case 403:
            errorMessage = 'Your account has been disabled. Please contact support.';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message === 'Invalid response from server') {
        errorMessage = 'Server returned invalid response. Please try again.';
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="flex w-full max-w-5xl bg-white shadow-2xl rounded-lg overflow-hidden">
          {/* Left Side - Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                SIGN <span className="text-indigo-500">IN</span>
              </h2>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Username or Email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  value={loginField}
                  onChange={(e) => setLoginField(e.target.value)}
                  required
                  disabled={loading || isRedirecting}
                />
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || isRedirecting}
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || isRedirecting}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-gray-600">
                    Stay signed in
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-indigo-500 hover:text-indigo-600 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || isRedirecting}
                className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 text-sm ${
                  loading || isRedirecting
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                {loading || isRedirecting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {isRedirecting ? 'Redirecting...' : 'Logging in...'}
                  </div>
                ) : (
                  'SIGN IN'
                )}
              </button>
            </form>

            <div className="mt-6">
              <p className="text-center text-sm text-gray-500 mb-4">Or Sign In with</p>
              <div className="flex justify-center space-x-4">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="#1DA1F2" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center bg-indigo-50 py-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Not a member?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-500 hover:text-indigo-600 font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Logo */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
            <img 
              src={logo} 
              alt="Campus Connect Logo" 
              className="max-w-md w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}