import React, { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import { addNotification } from '../features/notifications/notificationSlice';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import { Calendar, Mail, Lock, User } from 'lucide-react';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const mockUsers = [
    { id: '1', name: 'Admin User', email: 'admin@hospital.com', role: 'admin' as const },
    { id: '2', name: 'Dr. Sarah Johnson', email: 'doctor@hospital.com', role: 'doctor' as const, specialization: 'Cardiology' },
    { id: '3', name: 'John Doe', email: 'patient@hospital.com', role: 'patient' as const },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginStart());

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = mockUsers.find(u => u.email === email);
      
      if (user) {
        dispatch(loginSuccess({
          ...user,
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
        }));
        dispatch(addNotification({
          type: 'success',
          title: 'Welcome back!',
          message: `You have successfully logged in as ${user.role}.`
        }));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      dispatch(loginFailure('Invalid email or password'));
      dispatch(addNotification({
        type: 'error',
        title: 'Login Failed',
        message: 'Please check your credentials and try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="bg-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">MediCare</h2>
          <p className="mt-2 text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <Card className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              {isLogin ? 'Sign in' : 'Sign up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Demo Accounts</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div>👨‍💼 Admin: admin@hospital.com</div>
              <div>👨‍⚕️ Doctor: doctor@hospital.com</div>
              <div>👤 Patient: patient@hospital.com</div>
              <div className="text-gray-500 mt-2">Password: any value</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;