import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: 'patient1',
    patientName: 'John Doe',
    doctorId: '1',
    doctorName: 'Dr. Sarah Johnson',
    date: '2025-01-20',
    time: '09:00',
    status: 'pending',
    notes: 'Regular checkup',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    patientId: 'patient2',
    patientName: 'Jane Smith',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    date: '2025-01-18',
    time: '14:00',
    status: 'approved',
    notes: 'Follow-up consultation',
    createdAt: '2025-01-14T09:30:00Z',
  },
];

const initialState: AppointmentState = {
  appointments: mockAppointments,
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    updateAppointmentStatus: (state, action: PayloadAction<{ id: string; status: Appointment['status'] }>) => {
      const appointment = state.appointments.find(a => a.id === action.payload.id);
      if (appointment) {
        appointment.status = action.payload.status;
      }
    },
    cancelAppointment: (state, action: PayloadAction<string>) => {
      const appointment = state.appointments.find(a => a.id === action.payload);
      if (appointment) {
        appointment.status = 'cancelled';
      }
    },
  },
});

export const { setLoading, setError, addAppointment, updateAppointmentStatus, cancelAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;