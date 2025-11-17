import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Register() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({ user_id: userId, password });
      navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-apple shadow-apple-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Memos</h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-apple">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                User ID
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="input-field"
                placeholder="Choose a user ID"
                required
                minLength={3}
                maxLength={50}
                autoFocus
              />
              <p className="mt-1 text-sm text-gray-500">
                Minimum 3 characters, maximum 50
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Choose a password"
                required
                minLength={6}
              />
              <p className="mt-1 text-sm text-gray-500">Minimum 6 characters</p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
