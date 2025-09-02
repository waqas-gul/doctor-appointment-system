import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  fee: number;
  rating: number;
  avatar: string;
  availability: {
    day: string;
    slots: string[];
  }[];
  phone: string;
  address: string;
}

interface DoctorState {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  selectedDoctor: Doctor | null;
}

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    specialization: 'Cardiology',
    experience: 12,
    fee: 150,
    rating: 4.8,
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
    availability: [
      { day: 'Monday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { day: 'Tuesday', slots: ['09:00', '10:00', '14:00', '15:00', '16:00'] },
      { day: 'Wednesday', slots: ['10:00', '11:00', '14:00', '15:00'] },
    ],
    phone: '+1-555-0123',
    address: '123 Medical Center Dr, Healthcare City',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    specialization: 'Neurology',
    experience: 15,
    fee: 200,
    rating: 4.9,
    avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300',
    availability: [
      { day: 'Monday', slots: ['08:00', '09:00', '13:00', '14:00'] },
      { day: 'Thursday', slots: ['08:00', '09:00', '10:00', '13:00', '14:00'] },
      { day: 'Friday', slots: ['09:00', '10:00', '11:00'] },
    ],
    phone: '+1-555-0124',
    address: '456 Brain Institute Ave, Healthcare City',
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@hospital.com',
    specialization: 'Dermatology',
    experience: 8,
    fee: 120,
    rating: 4.7,
    avatar: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300',
    availability: [
      { day: 'Tuesday', slots: ['10:00', '11:00', '14:00', '15:00', '16:00'] },
      { day: 'Wednesday', slots: ['09:00', '10:00', '11:00', '15:00'] },
      { day: 'Friday', slots: ['09:00', '10:00', '14:00', '15:00'] },
    ],
    phone: '+1-555-0125',
    address: '789 Skin Care Plaza, Healthcare City',
  },
];

const initialState: DoctorState = {
  doctors: mockDoctors,
  loading: false,
  error: null,
  selectedDoctor: null,
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    selectDoctor: (state, action: PayloadAction<Doctor>) => {
      state.selectedDoctor = action.payload;
    },
    updateDoctorAvailability: (state, action: PayloadAction<{ doctorId: string; availability: Doctor['availability'] }>) => {
      const doctor = state.doctors.find(d => d.id === action.payload.doctorId);
      if (doctor) {
        doctor.availability = action.payload.availability;
      }
    },
  },
});

export const { setLoading, setError, selectDoctor, updateDoctorAvailability } = doctorSlice.actions;
export default doctorSlice.reducer;