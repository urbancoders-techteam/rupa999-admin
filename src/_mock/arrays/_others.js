import _mock from '../_mock';
import { randomInArray } from '../utils';

// ----------------------------------------------------------------------

export const _carouselsMembers = [...Array(6)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  role: _mock.role(index),
  avatar: `/assets/images/portraits/portrait_${index + 1}.jpg`,
}));

// ----------------------------------------------------------------------

export const _faqs = [...Array(8)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: `Questions ${index + 1}`,
  detail: _mock.text.description(index),
}));

// ----------------------------------------------------------------------

export const _addressBooks = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  receiver: _mock.name.fullName(index),
  fullAddress: _mock.address.fullAddress(index),
  phoneNumber: _mock.phoneNumber(index),
  addressType: index === 0 ? 'Home' : 'Office',
  isDefault: index === 0,
}));

// ----------------------------------------------------------------------

export const _skills = [...Array(3)].map((_, index) => ({
  label: ['Development', 'Design', 'Marketing'][index],
  value: _mock.number.percent(index),
}));

// ----------------------------------------------------------------------

export const _contacts = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  username: _mock.name.fullName(index),
  avatar: _mock.image.avatar(index),
  address: _mock.address.fullAddress(index),
  phone: _mock.phoneNumber(index),
  email: _mock.email(index),
  lastActivity: _mock.time(index),
  status: randomInArray(['online', 'offline', 'away', 'busy']),
  role: _mock.role(index),
}));

// ----------------------------------------------------------------------

export const _notifications = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  title: [
    'Your order is placed',
    'Sylvan King',
    'You have new message',
    'You have new mail',
    'Delivery processing',
  ][index],
  description: [
    'waiting for shipping',
    'answered to your comment on the Minimal',
    '5 unread messages',
    'sent from Guido Padberg',
    'Your order is being shipped',
  ][index],
  avatar: [null, _mock.image.avatar(2), null, null, null][index],
  type: ['order_placed', 'friend_interactive', 'chat_message', 'mail', 'order_shipped'][index],
  createdAt: _mock.time(index),
  isUnRead: [true, true, false, false, false][index],
}));

// ----------------------------------------------------------------------

export const _mapContact = [
  {
    latlng: [33, 65],
    address: _mock.address.fullAddress(1),
    phoneNumber: _mock.phoneNumber(1),
  },
  {
    latlng: [-12.5, 18.5],
    address: _mock.address.fullAddress(2),
    phoneNumber: _mock.phoneNumber(2),
  },
];

// ----------------------------------------------------------------------

export const _socials = [
  {
    value: 'facebook',
    name: 'FaceBook',
    icon: 'eva:facebook-fill',
    color: '#1877F2',
    path: 'https://www.facebook.com/caitlyn.kerluke',
  },
  {
    value: 'instagram',
    name: 'Instagram',
    icon: 'ant-design:instagram-filled',
    color: '#E02D69',
    path: 'https://www.instagram.com/caitlyn.kerluke',
  },
  {
    value: 'linkedin',
    name: 'Linkedin',
    icon: 'eva:linkedin-fill',
    color: '#007EBB',
    path: 'https://www.linkedin.com/caitlyn.kerluke',
  },
  {
    value: 'twitter',
    name: 'Twitter',
    icon: 'eva:twitter-fill',
    color: '#00AAEC',
    path: 'https://www.twitter.com/caitlyn.kerluke',
  },
];



export const giftListData = [
  {
    "id": 1,
    "limit": 5000,
    "remaining": 3200,
    "amount": 1800,
    "createdAt": "2025-10-31 10:45:00",
    "status": "active",
    "code": "TXN-8542",
    "action": "Edit"
  },
  {
    "id": 2,
    "limit": 10000,
    "remaining": 7500,
    "amount": 2500,
    "createdAt": "2025-10-30 14:30:00",
    "status": "active",
    "code": "TXN-9147",
    "action": "Edit"
  },
  {
    "id": 3,
    "limit": 7000,
    "remaining": 0,
    "amount": 7000,
    "createdAt": "2025-10-29 09:12:00",
    "status": "completed",
    "code": "TXN-6713",
    "action": "View"
  },
  {
    "id": 4,
    "limit": 3000,
    "remaining": 3000,
    "amount": 0,
    "createdAt": "2025-10-31 12:00:00",
    "status": "pending",
    "code": "TXN-2239",
    "action": "Edit"
  },
  {
    "id": 5,
    "limit": 9000,
    "remaining": 1000,
    "amount": 8000,
    "createdAt": "2025-10-28 16:45:00",
    "status": "active",
    "code": "TXN-7431",
    "action": "View"
  },
  {
    "id": 6,
    "limit": 12000,
    "remaining": 11800,
    "amount": 200,
    "createdAt": "2025-10-30 11:10:00",
    "status": "inactive",
    "code": "TXN-5082",
    "action": "Edit"
  },
  {
    "id": 7,
    "limit": 8000,
    "remaining": 4000,
    "amount": 4000,
    "createdAt": "2025-10-31 08:20:00",
    "status": "completed",
    "code": "TXN-3907",
    "action": "View"
  },
  {
    "id": 8,
    "limit": 6000,
    "remaining": 5500,
    "amount": 500,
    "createdAt": "2025-10-30 19:25:00",
    "status": "pending",
    "code": "TXN-1198",
    "action": "Edit"
  },
  {
    "id": 4,
    "limit": 3000,
    "remaining": 3000,
    "amount": 0,
    "createdAt": "2025-10-31 12:00:00",
    "status": "pending",
    "code": "TXN-2239",
    "action": "Edit"
  },
  {
    "id": 5,
    "limit": 9000,
    "remaining": 1000,
    "amount": 8000,
    "createdAt": "2025-10-28 16:45:00",
    "status": "active",
    "code": "TXN-7431",
    "action": "View"
  },
  {
    "id": 6,
    "limit": 12000,
    "remaining": 11800,
    "amount": 200,
    "createdAt": "2025-10-30 11:10:00",
    "status": "inactive",
    "code": "TXN-5082",
    "action": "Edit"
  },
  {
    "id": 7,
    "limit": 8000,
    "remaining": 4000,
    "amount": 4000,
    "createdAt": "2025-10-31 08:20:00",
    "status": "completed",
    "code": "TXN-3907",
    "action": "View"
  },
  {
    "id": 8,
    "limit": 6000,
    "remaining": 5500,
    "amount": 500,
    "createdAt": "2025-10-30 19:25:00",
    "status": "pending",
    "code": "TXN-1198",
    "action": "Edit"
  }
]
