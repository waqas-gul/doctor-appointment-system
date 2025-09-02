import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  avatar?: string;
}

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
}

const mockPatients: Patient[] = [
  {
    id: 'patient1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0001',
    dateOfBirth: '1985-06-15',
    address: '123 Main St, City',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: 'patient2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1-555-0002',
    dateOfBirth: '1990-03-22',
    address: '456 Oak Ave, City',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
];

const initialState: PatientState = {
  patients: mockPatients,
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.push(action.payload);
    },
  },
});

export const { setLoading, setError, addPatient } = patientSlice.actions;
export default patientSlice.reducer;