import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Left Side: Artwork/Image */}
      <div className="w-full lg:w-1/2 p-5 flex items-center justify-center">
        <img 
          src="/02.webp" 
          alt="Artistic Representation"
          className="object-cover h-full rounded-lg shadow-lg" 
        />
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-5">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
          <h1 className="text-5xl font-extrabold text-center text-gray-900">Create Account</h1>
          <p className="text-lg text-center text-gray-500">Join us and start your journey!</p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="block w-full px-4 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="block w-full px-4 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="block w-full px-4 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
              Register
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
