import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { addAppointment } from '../features/appointments/appointmentSlice';
import { addNotification } from '../features/notifications/notificationSlice';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Modal from '../components/Common/Modal';
import { Calendar, Clock, User, Star, MapPin, Phone } from 'lucide-react';

const BookAppointment: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { doctors } = useAppSelector((state) => state.doctors);
  
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAvailableSlots = () => {
    if (!selectedDoctor || !selectedDate) return [];
    
    const selectedDay = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = selectedDoctor.availability.find(
      (day: any) => day.day === selectedDay
    );
    
    return dayAvailability?.slots || [];
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    const appointment = {
      id: Date.now().toString(),
      patientId: user?.id || '',
      patientName: user?.name || '',
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date: selectedDate,
      time: selectedTime,
      status: 'pending' as const,
      notes,
      createdAt: new Date().toISOString(),
    };

    dispatch(addAppointment(appointment));
    dispatch(addNotification({
      type: 'success',
      title: 'Appointment Booked',
      message: `Your appointment with ${selectedDoctor.name} has been booked for ${selectedDate} at ${selectedTime}.`
    }));

    // Reset form
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
    setIsModalOpen(false);
  };

  const openBookingModal = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600 mt-2">Choose from our available doctors and book your appointment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <div className="text-center">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
              <p className="text-blue-600 font-medium">{doctor.specialization}</p>
              
              <div className="flex items-center justify-center mt-2 space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{doctor.rating}</span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{doctor.experience} years experience</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{doctor.address}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold text-blue-900">${doctor.fee}</p>
                <p className="text-sm text-blue-600">Consultation fee</p>
              </div>

              <Button
                onClick={() => openBookingModal(doctor)}
                className="w-full mt-4"
              >
                Book Appointment
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book Appointment"
        size="lg"
      >
        {selectedDoctor && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{selectedDoctor.name}</h4>
                <p className="text-blue-600">{selectedDoctor.specialization}</p>
                <p className="text-sm text-gray-600">${selectedDoctor.fee} consultation fee</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Times
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {getAvailableSlots().map((slot: string) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        selectedTime === slot
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {selectedDate && getAvailableSlots().length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">No available slots for this date</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any specific symptoms or concerns..."
              />
            </div>

            <div className="flex space-x-4">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedTime}
                className="flex-1"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookAppointment;