import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Snackbar from '@mui/material/Snackbar';  // Import Snackbar from Material-UI
import Alert from '@mui/material/Alert';  // Import Alert for a better styled notification

function RegisterPage() {
  const { register, checkAvailability } = useAuth();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false); // State to control Snackbar visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [availability, setAvailability] = useState({ username: '', email: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register(formData);
      setShowSnackbar(true); // Show snackbar on success
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Delay navigating to login page for 2 seconds so the snackbar can be seen
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'username' || name === 'email') {
      try {
        const result = await checkAvailability(name, value);
        setAvailability((prev) => ({
          ...prev,
          [name]: result.available ? 'Available' : result.message, // Assumes the result has an 'available' property
        }));
      } catch (error) {
        setAvailability((prev) => ({
          ...prev,
          [name]: 'Error checking availability',
        }));
      }
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Side: Artwork/Image */}
      <div className="w-full lg:w-1/2 p-5 flex items-center justify-center">
        <img 
          src="/02.webp" 
          alt="Artistic Representation"
          className="object-cover h-full rounded-lg shadow-lg" 
        />
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-2">
        <div className="w-full p-8 space-y-2">
          <div className="flex items-center justify-center space-x-4">
            <h1 className="text-5xl sm:text-8xl md:text-6xl xl:text-8xl font-extrabold text-gray-800">Twodo</h1>
            <div className="border-l-2 border-gray-800 h-14 mx-2"></div>
            <p className="text-md sm:text-2xl font-bold text-gray-800">Wave your life into a flow</p>
          </div>
          <p className="text-center text-gray-600">Create your account here</p>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  className="block w-full px-4 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {availability.username && (
                  <p className={`text-sm ${availability.username === 'Available' ? 'text-green-500' : 'text-red-500'}`}>
                    {availability.username}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="block w-full px-4 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {availability.email && (
                  <p className={`text-sm ${availability.email === 'Available' ? 'text-green-500' : 'text-red-500'}`}>
                    {availability.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="block w-full px-4 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="block w-full px-4 py-2 mt-1 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
                Register
              </button>
            </div>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Snackbar for success message */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Registration successful! Redirecting to login...
        </Alert>
      </Snackbar>
    </div>
  );
}

export default RegisterPage;
