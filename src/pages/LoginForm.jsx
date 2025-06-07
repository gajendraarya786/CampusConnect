import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginForm() {
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginField || !password) {
      setError("Please enter both email/username and password.");
      return;
    }

    setLoading(true);

    try {
      const isEmail = loginField.includes('@');
      const loginData = {
        password,
        ...(isEmail ? { email: loginField } : { username: loginField })
      };

      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        loginData,
        { withCredentials: true }
      );

      // Store tokens and user data
      if (response.data?.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }
      if (response.data?.data?.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      if (response.data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      // Show success message and start redirect
      toast.success('Login successful! Redirecting...');
      setIsRedirecting(true);
      
      // Add a small delay before redirect for better UX
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Handle specific error cases
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
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md bg-white shadow-2xl rounded-xl p-6 sm:p-8 transform transition-all duration-300 hover:shadow-indigo-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm animate-fade-in">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              placeholder="email@stu.upes.ac.in or username"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200"
              value={loginField}
              onChange={(e) => setLoginField(e.target.value)}
              required
              disabled={loading || isRedirecting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || isRedirecting}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-gray-600">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || isRedirecting}
            className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 text-sm ${
              loading || isRedirecting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-[1.02]'
            }`}
          >
            {loading || isRedirecting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                {isRedirecting ? 'Redirecting...' : 'Logging in...'}
              </div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-500 font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 