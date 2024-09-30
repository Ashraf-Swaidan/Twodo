import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-5">
        <div className="w-full max-w-md p-8 space-y-4">
          <h1 className="text-7xl font-extrabold text-center text-gray-800">Twodo In!</h1>
          <p className="text-center text-gray-600">Please log in to your account</p>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="block w-full px-4 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="block w-full px-4 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
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
