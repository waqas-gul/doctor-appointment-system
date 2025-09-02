import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { updateAppointmentStatus, cancelAppointment } from '../features/appointments/appointmentSlice';
import { addNotification } from '../features/notifications/notificationSlice';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import { Calendar, Clock, User, Phone, Check, X, Eye } from 'lucide-react';

const Appointments: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { appointments } = useAppSelector((state) => state.appointments);
  const [filter, setFilter] = useState('all');

  const getFilteredAppointments = () => {
    let filtered = appointments;

    // Filter by user role
    switch (user?.role) {
      case 'doctor':
        filtered = appointments.filter(a => a.doctorId === user.id);
        break;
      case 'patient':
        filtered = appointments.filter(a => a.patientId === user.id);
        break;
      // Admin sees all appointments
    }

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(a => a.status === filter);
    }

    return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const handleStatusUpdate = (appointmentId: string, status: 'approved' | 'cancelled') => {
    dispatch(updateAppointmentStatus({ id: appointmentId, status }));
    dispatch(addNotification({
      type: status === 'approved' ? 'success' : 'info',
      title: `Appointment ${status}`,
      message: `The appointment has been ${status}.`
    }));
  };

  const handleCancel = (appointmentId: string) => {
    dispatch(cancelAppointment(appointmentId));
    dispatch(addNotification({
      type: 'info',
      title: 'Appointment Cancelled',
      message: 'The appointment has been cancelled successfully.'
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'admin' 
              ? 'Manage all system appointments' 
              : user?.role === 'doctor'
              ? 'Manage your patient appointments'
              : 'View your booked appointments'
            }
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <Card className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600">
            {filter === 'all' ? 'No appointments have been booked yet.' : `No ${filter} appointments found.`}
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user?.role === 'patient' ? appointment.doctorName : appointment.patientName}
                        </h3>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>
                            {user?.role === 'patient' 
                              ? `Dr. ${appointment.doctorName}` 
                              : user?.role === 'doctor'
                              ? appointment.patientName
                              : `${appointment.doctorName} → ${appointment.patientName}`
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            Booked: {new Date(appointment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Notes:</span> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  {user?.role === 'doctor' && appointment.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleStatusUpdate(appointment.id, 'approved')}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </>
                  )}

                  {user?.role === 'admin' && appointment.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleStatusUpdate(appointment.id, 'approved')}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}

                  {user?.role === 'patient' && appointment.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}

                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;