import React from 'react';
import { useAppSelector } from '../app/hooks';
import Card from '../components/Common/Card';
import { 
  Calendar, 
  Users, 
  UserCheck, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { appointments } = useAppSelector((state) => state.appointments);
  const { doctors } = useAppSelector((state) => state.doctors);
  const { patients } = useAppSelector((state) => state.patients);

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            title: 'Total Doctors',
            value: doctors.length,
            icon: UserCheck,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
          },
          {
            title: 'Total Patients',
            value: patients.length,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
          },
          {
            title: 'Total Appointments',
            value: appointments.length,
            icon: Calendar,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
          },
          {
            title: 'Pending Approvals',
            value: appointments.filter(a => a.status === 'pending').length,
            icon: AlertCircle,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
          },
        ];
      case 'doctor':
        const doctorAppointments = appointments.filter(a => a.doctorId === user.id);
        return [
          {
            title: 'Today\'s Appointments',
            value: doctorAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
            icon: Calendar,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
          },
          {
            title: 'Pending Requests',
            value: doctorAppointments.filter(a => a.status === 'pending').length,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
          },
          {
            title: 'Completed',
            value: doctorAppointments.filter(a => a.status === 'completed').length,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
          },
          {
            title: 'Total Patients',
            value: new Set(doctorAppointments.map(a => a.patientId)).size,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
          },
        ];
      case 'patient':
        const patientAppointments = appointments.filter(a => a.patientId === user.id);
        return [
          {
            title: 'Upcoming Appointments',
            value: patientAppointments.filter(a => a.status === 'approved' && new Date(a.date) > new Date()).length,
            icon: Calendar,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
          },
          {
            title: 'Pending Approval',
            value: patientAppointments.filter(a => a.status === 'pending').length,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
          },
          {
            title: 'Completed',
            value: patientAppointments.filter(a => a.status === 'completed').length,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
          },
          {
            title: 'Available Doctors',
            value: doctors.length,
            icon: UserCheck,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
          },
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  const getRecentAppointments = () => {
    switch (user?.role) {
      case 'admin':
        return appointments.slice(0, 5);
      case 'doctor':
        return appointments.filter(a => a.doctorId === user.id).slice(0, 5);
      case 'patient':
        return appointments.filter(a => a.patientId === user.id).slice(0, 5);
      default:
        return [];
    }
  };

  const recentAppointments = getRecentAppointments();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening in your {user?.role} dashboard today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
          <div className="space-y-4">
            {recentAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No appointments found</p>
            ) : (
              recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.role === 'doctor' ? appointment.patientName : appointment.doctorName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {user?.role === 'patient' && (
              <>
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Book New Appointment</span>
                  </div>
                </button>
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Find Doctors</span>
                  </div>
                </button>
              </>
            )}
            {user?.role === 'doctor' && (
              <>
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Manage Schedule</span>
                  </div>
                </button>
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">View Patients</span>
                  </div>
                </button>
              </>
            )}
            {user?.role === 'admin' && (
              <>
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">View Analytics</span>
                  </div>
                </button>
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-gray-900">Pending Approvals</span>
                  </div>
                </button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;