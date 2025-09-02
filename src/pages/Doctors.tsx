import React, { useState } from 'react';
import { useAppSelector } from '../app/hooks';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import { Star, MapPin, Phone, Mail, Calendar, User } from 'lucide-react';

const Doctors: React.FC = () => {
  const { doctors } = useAppSelector((state) => state.doctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');

  const specializations = Array.from(new Set(doctors.map(d => d.specialization)));

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = specializationFilter === 'all' || 
                                 doctor.specialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Doctors</h1>
        <p className="text-gray-600 mt-2">Find and connect with our experienced medical professionals.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search doctors by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="sm:w-64">
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <Card className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <div className="text-center">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{doctor.specialization}</p>
                
                <div className="flex items-center justify-center mb-4 space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600 font-medium">{doctor.rating}</span>
                  <span className="text-sm text-gray-500">({Math.floor(Math.random() * 100) + 20} reviews)</span>
                </div>

                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{doctor.experience} years experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs">{doctor.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs">{doctor.address}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-blue-900">${doctor.fee}</p>
                    <p className="text-sm text-blue-600">Consultation fee</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Available Days</h4>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {doctor.availability.map((day, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {day.day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button variant="secondary" className="w-full">
                    View Profile
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

export default Doctors;