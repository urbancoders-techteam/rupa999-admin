import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import authReducer from './slices/auth_slices';
import staffReducer from './slices/staff_slices';
import roleReducer from './slices/role_slices';
import permissionReducer from './slices/permission_slices';

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  auth: authReducer,
  staff: staffReducer,
  role: roleReducer,
  permission: permissionReducer,
});

export default rootReducer;
