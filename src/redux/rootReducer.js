import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import authReducer from './slices/auth_slices';

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
