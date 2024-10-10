import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await login(email, password);
      console.log('Login successful');
      navigate('/todos');
      // Redirect logic can be added here if needed
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Side: Artwork/Image */}
      <div className="w-full lg:w-1/2 p-5 flex items-center justify-center">
        <img 
          src="/02.webp" 
          alt="Artistic Representation"
          className="object-cover h-full rounded-lg" 
        />
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-2">
        <div className="w-full p-8 space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <h1 className="text-5xl sm:text-8xl font-extrabold text-gray-800">Twodo</h1>
            <div className="border-l-2 border-gray-800 h-14 mx-2"></div>
            <p className="text-md sm:text-2xl font-bold text-gray-800">Wave your life into a flow</p>
          </div>
          <p className="text-center text-gray-600">login here to your account</p>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Container for input fields with limited width */}
            <div className="max-w-md mx-auto space-y-5"> {/* Limit width and center */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2 mt-5 font-semibold text-white ${loading ? 'bg-gray-400' : 'bg-blue-600'} rounded-md hover:${loading ? '' : 'bg-blue-700'} transition`}
                disabled={loading} // Disable button while loading
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 0115.474-3.018A7.975 7.975 0 0012 4a8 8 0 100 16 7.975 7.975 0 007.474-4.982A8 8 0 014 12z"
                      />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>

          <p className="text-sm text-center text-gray-600">
            Don't have an account? 
            <Link to="/register" className="text-blue-600 hover:underline"> Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
