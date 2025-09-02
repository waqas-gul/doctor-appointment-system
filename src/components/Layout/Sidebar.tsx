import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { 
  Home, 
  Calendar, 
  Users, 
  UserCheck, 
  Settings, 
  BarChart3,
  Clock,
  User
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { name: 'Doctors', href: '/doctors', icon: UserCheck },
          { name: 'Patients', href: '/patients', icon: Users },
          { name: 'Appointments', href: '/appointments', icon: Calendar },
          { name: 'Analytics', href: '/analytics', icon: BarChart3 },
          { name: 'Settings', href: '/settings', icon: Settings },
        ];
      case 'doctor':
        return [
          ...baseItems,
          { name: 'My Schedule', href: '/schedule', icon: Clock },
          { name: 'Appointments', href: '/appointments', icon: Calendar },
          { name: 'Patients', href: '/patients', icon: Users },
          { name: 'Profile', href: '/profile', icon: User },
        ];
      case 'patient':
        return [
          ...baseItems,
          { name: 'Book Appointment', href: '/book-appointment', icon: Calendar },
          { name: 'My Appointments', href: '/my-appointments', icon: Clock },
          { name: 'Doctors', href: '/doctors', icon: UserCheck },
          { name: 'Profile', href: '/profile', icon: User },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;