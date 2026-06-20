import { createSelector, createSlice } from '@reduxjs/toolkit';

const BOOKING_FEE = 20;
const MAX_SEATS = 10;

const initialState = {
  selectedMovie: null,
  selectedTheatre: null,
  selectedDate: null,
  selectedFormat: '2D',
  selectedShowtime: null,
  selectedSeats: [],
  lastBooking: null
};

const calcTotals = (state) => {
  const pricePerSeat = state.selectedShowtime?.pricePerSeat || 0;
  const ticketPrice = pricePerSeat * state.selectedSeats.length;
  const bookingFee = state.selectedSeats.length > 0 ? BOOKING_FEE : 0;
  return { ticketPrice, bookingFee, total: ticketPrice + bookingFee };
};

const selectBookingState = (state) => state.booking;

export const selectTotals = createSelector([selectBookingState], (booking) => calcTotals(booking));

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setMovie: (state, action) => {
      state.selectedMovie = action.payload;
      state.selectedTheatre = null;
      state.selectedDate = null;
      state.selectedShowtime = null;
      state.selectedSeats = [];
    },
    setTheatre: (state, action) => {
      state.selectedTheatre = action.payload;
      state.selectedShowtime = null;
      state.selectedSeats = [];
    },
    setDate: (state, action) => {
      state.selectedDate = action.payload;
      state.selectedShowtime = null;
      state.selectedSeats = [];
    },
    setFormat: (state, action) => {
      state.selectedFormat = action.payload;
      state.selectedShowtime = null;
      state.selectedSeats = [];
    },
    setShowtime: (state, action) => {
      state.selectedShowtime = action.payload;
      state.selectedSeats = [];
    },
    toggleSeat: (state, action) => {
      const seatId = action.payload;
      const idx = state.selectedSeats.indexOf(seatId);
      if (idx >= 0) {
        state.selectedSeats.splice(idx, 1);
      } else {
        if (state.selectedSeats.length >= MAX_SEATS) return;
        state.selectedSeats.push(seatId);
      }
    },
    setOccupiedSeats: (state, action) => {
      if (state.selectedShowtime) {
        state.selectedShowtime.occupiedSeats = action.payload;
      }
    },
    setLastBooking: (state, action) => {
      state.lastBooking = action.payload;
    },
    resetBookingFlow: (state) => {
      state.selectedSeats = [];
      state.selectedShowtime = null;
      state.lastBooking = null;
    }
  }
});

export const {
  setMovie,
  setTheatre,
  setDate,
  setFormat,
  setShowtime,
  toggleSeat,
  setOccupiedSeats,
  setLastBooking,
  resetBookingFlow
} = bookingSlice.actions;

export const MAX_SEATS_PER_BOOKING = MAX_SEATS;

export default bookingSlice.reducer;
