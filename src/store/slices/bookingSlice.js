import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
      state.loading = false;
    },
    addBooking: (state, action) => {
      state.bookings.unshift(action.payload);
    },
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.bookings.findIndex(b => b.id === id);
      if (index !== -1) {
        state.bookings[index].status = status;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setBookings, addBooking, updateBookingStatus, setError } = bookingSlice.actions;
export default bookingSlice.reducer;
