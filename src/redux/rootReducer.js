import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import apkReducer from './slices/apk_slices';
import authReducer from './slices/auth_slices';
import bidReducer from './slices/bid_slices';
import faqReducer from './slices/faq_slices';
import marketResultReducer from './slices/market_result_slices';
import marketReducer from './slices/market_slices';
import notificationReducer from './slices/notification_slices';
import permissionReducer from './slices/permission_slices';
import roleReducer from './slices/role_slices';
import staffReducer from './slices/staff_slices';
import starlineMarketReducer from './slices/starline_market_slices';
import starlineMarketResultReducer from './slices/starline_market_result_slices';
import userReducer from './slices/user_slices';
import withdrawalReducer from './slices/withdrawal_slices';

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  auth: authReducer,
  bid: bidReducer,
  staff: staffReducer,
  role: roleReducer,
  permission: permissionReducer,
  market: marketReducer,
  marketResult: marketResultReducer,
  starlineMarket: starlineMarketReducer,
  starlineMarketResult: starlineMarketResultReducer,
  user: userReducer,
  notification: notificationReducer,
  faq: faqReducer,
  apk: apkReducer,
  withdrawal: withdrawalReducer,
});

export default rootReducer;
