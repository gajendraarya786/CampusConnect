import axios from "axios";
import React, { useState } from "react";

export default function LoginForm() {
  const [loginField, setLoginField] = useState(""); // Can be email or username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginField || !password) {
      setError("Please enter both email/username and password.");
      return;
    }

    setLoading(true);

    try {
      // Determine if input is email or username
      const isEmail = loginField.includes('@');
      const loginData = {
        password,
        ...(isEmail ? { email: loginField } : { username: loginField })
      };

      // Send login request with credentials (for cookies)
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        loginData,
        { withCredentials: true }
      );

      // Store tokens in localStorage as backup (optional)
      if (response.data?.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }
      if (response.data?.data?.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      if (response.data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      // Handle successful login - you can redirect here
      alert('Login successful!');
    } catch (error) {
      // Axios error handling
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md bg-white shadow-xl rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              placeholder="email@stu.upes.ac.in or username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              value={loginField}
              onChange={(e) => setLoginField(e.target.value)}
              required
              disabled={loading}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-xs text-gray-500 sm:text-sm hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm sm:text-base ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-5 text-xs sm:text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}