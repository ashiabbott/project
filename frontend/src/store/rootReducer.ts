import { combineReducers } from '@reduxjs/toolkit';
import financialAdvisorReducer from './slices/financialAdvisorSlice';
// ... other imports

const rootReducer = combineReducers({
  financialAdvisor: financialAdvisorReducer,
  // ... other reducers
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
