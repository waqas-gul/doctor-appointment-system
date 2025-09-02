import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/auth/authSlice';
import doctorSlice from '../features/doctors/doctorSlice';
import appointmentSlice from '../features/appointments/appointmentSlice';
import patientSlice from '../features/patients/patientSlice';
import notificationSlice from '../features/notifications/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    doctors: doctorSlice,
    appointments: appointmentSlice,
    patients: patientSlice,
    notifications: notificationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;