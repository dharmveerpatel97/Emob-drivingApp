import {configureStore} from '@reduxjs/toolkit';
import rideReducer from './rideSlice';
import appReducer from './appSlice';
import evSlice from './evSlice';
export const store = configureStore({
  reducer: {
    ride: rideReducer,
    app: appReducer,
    eV: evSlice,
  },
});
