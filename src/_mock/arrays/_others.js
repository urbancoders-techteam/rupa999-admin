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

export const generalWithdrawHistoryData = [
  {
    "id": 1,
    "marketName": "Rohit Kumar",
    "userPhone": "9876543210",
    "amount": 5000,
    "payableAmount": 4950,
    "requestType": "Withdraw",
    "withdrawMode": "Bank Transfer",
    "upiName": "Rohit K",
    "upiID": "rohit@icici",
    "bankName": "ICICI Bank",
    "ifsc": "ICIC0001234",
    "status": "Pending",
    "reason": "",
    "createdAt": "2025-10-30 12:45 PM",
    "actions": ""
  },
  {
    "id": 2,
    "marketName": "Ankit Sharma",
    "userPhone": "9823456781",
    "amount": 3000,
    "payableAmount": 2980,
    "requestType": "Deposit",
    "withdrawMode": "UPI",
    "upiName": "Ankit S",
    "upiID": "ankit@ybl",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0004521",
    "status": "Completed",
    "reason": "",
    "createdAt": "2025-10-30 10:22 AM",
    "actions": ""
  },
  {
    "id": 3,
    "marketName": "Pooja Verma",
    "userPhone": "9701123456",
    "amount": 800,
    "payableAmount": 780,
    "requestType": "Withdraw",
    "withdrawMode": "UPI",
    "upiName": "Pooja V",
    "upiID": "pooja@paytm",
    "bankName": "SBI Bank",
    "ifsc": "SBIN0000456",
    "status": "Rejected",
    "reason": "Invalid UPI ID",
    "createdAt": "2025-10-29 09:15 PM",
    "actions": ""
  },
  {
    "id": 4,
    "marketName": "Saurabh Patel",
    "userPhone": "9812332210",
    "amount": 1500,
    "payableAmount": 1485,
    "requestType": "Withdraw",
    "withdrawMode": "Bank Transfer",
    "upiName": "Saurabh P",
    "upiID": "saurabh@axis",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0001110",
    "status": "Completed",
    "reason": "",
    "createdAt": "2025-10-28 03:10 PM",
    "actions": ""
  },
  {
    "id": 5,
    "marketName": "Nikita Jain",
    "userPhone": "9123456780",
    "amount": 2500,
    "payableAmount": 2475,
    "requestType": "Withdraw",
    "withdrawMode": "UPI",
    "upiName": "Nikita J",
    "upiID": "nikita@upi",
    "bankName": "Kotak Bank",
    "ifsc": "KKBK0000888",
    "status": "Completed",
    "reason": "",
    "createdAt": "2025-10-27 07:30 PM",
    "actions": ""
  },
  {
    "id": 6,
    "marketName": "Amit Singh",
    "userPhone": "9911223344",
    "amount": 1200,
    "payableAmount": 1185,
    "requestType": "Withdraw",
    "withdrawMode": "Bank Transfer",
    "upiName": "Amit S",
    "upiID": "amit@hdfc",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0001200",
    "status": "Failed",
    "reason": "Bank server timeout",
    "createdAt": "2025-10-26 11:00 AM",
    "actions": ""
  },
  {
    "id": 7,
    "marketName": "Vikas Mehta",
    "userPhone": "9955446677",
    "amount": 750,
    "payableAmount": 740,
    "requestType": "Withdraw",
    "withdrawMode": "UPI",
    "upiName": "Vikas M",
    "upiID": "vikas@okhdfcbank",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0004523",
    "status": "Pending",
    "reason": "",
    "createdAt": "2025-10-25 05:45 PM",
    "actions": ""
  },
  {
    "id": 8,
    "marketName": "Deepika Rathi",
    "userPhone": "9876601234",
    "amount": 3200,
    "payableAmount": 3175,
    "requestType": "Deposit",
    "withdrawMode": "UPI",
    "upiName": "Deepika R",
    "upiID": "deepika@axis",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0004321",
    "status": "Completed",
    "reason": "",
    "createdAt": "2025-10-24 04:00 PM",
    "actions": ""
  },
  {
    "id": 9,
    "marketName": "Rahul Tiwari",
    "userPhone": "9887766554",
    "amount": 4500,
    "payableAmount": 4470,
    "requestType": "Withdraw",
    "withdrawMode": "Bank Transfer",
    "upiName": "Rahul T",
    "upiID": "rahul@okaxis",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0002310",
    "status": "Completed",
    "reason": "",
    "createdAt": "2025-10-23 02:10 PM",
    "actions": ""
  },
  {
    "id": 10,
    "marketName": "Sneha Kapoor",
    "userPhone": "9900011122",
    "amount": 2000,
    "payableAmount": 1980,
    "requestType": "Withdraw",
    "withdrawMode": "UPI",
    "upiName": "Sneha K",
    "upiID": "sneha@icici",
    "bankName": "ICICI Bank",
    "ifsc": "ICIC0002345",
    "status": "Completed",
    "reason": "",
    "createdAt": "2025-10-22 08:15 PM",
    "actions": ""
  },
  {
    "id": 11,
    "marketName": "Kunal Joshi",
    "userPhone": "9765432109",
    "amount": 900,
    "payableAmount": 890,
    "requestType": "Withdraw",
    "withdrawMode": "UPI",
    "upiName": "Kunal J",
    "upiID": "kunal@ybl",
    "bankName": "SBI Bank",
    "ifsc": "SBIN0000345",
    "status": "Pending",
    "reason": "",
    "createdAt": "2025-10-21 11:50 AM",
    "actions": ""
  },
  {
    "id": 12,
    "marketName": "Aarav Desai",
    "userPhone": "9800221133",
    "amount": 10000,
    "payableAmount": 9950,
    "requestType": "Deposit",
    "withdrawMode": "Bank Transfer",
    "upiName": "Aarav D",
    "upiID": "aarav@okhdfcbank",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0003210",
    "status": "Completed",
    "reason": "",
    "createdAt": "2025-10-20 01:40 PM",
    "actions": ""
  },
  {
    "id": 13,
    "marketName": "Simran Gill",
    "userPhone": "9811002200",
    "amount": 2700,
    "payableAmount": 2675,
    "requestType": "Withdraw",
    "withdrawMode": "UPI",
    "upiName": "Simran G",
    "upiID": "simran@okaxis",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0008765",
    "status": "Completed",
    "reason": "",
    "createdAt": "2025-10-19 03:30 PM",
    "actions": ""
  },
  {
    "id": 14,
    "marketName": "Manish Kumar",
    "userPhone": "9888777665",
    "amount": 500,
    "payableAmount": 490,
    "requestType": "Withdraw",
    "withdrawMode": "UPI",
    "upiName": "Manish K",
    "upiID": "manish@ybl",
    "bankName": "SBI Bank",
    "ifsc": "SBIN0000211",
    "status": "Failed",
    "reason": "UPI not active",
    "createdAt": "2025-10-18 09:00 AM",
    "actions": ""
  },
  {
    "id": 15,
    "marketName": "Priya Nair",
    "userPhone": "9899988776",
    "amount": 1800,
    "payableAmount": 1785,
    "requestType": "Withdraw",
    "withdrawMode": "Bank Transfer",
    "upiName": "Priya N",
    "upiID": "priya@okaxis",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0000110",
    "status": "Pending",
    "reason": "",
    "createdAt": "2025-10-17 07:20 PM",
    "actions": ""
  },
  {
    "id": 16,
    "marketName": "Harsh Gupta",
    "userPhone": "9123409876",
    "amount": 4200,
    "payableAmount": 4180,
    "requestType": "Deposit",
    "withdrawMode": "UPI",
    "upiName": "Harsh G",
    "upiID": "harsh@okicici",
    "bankName": "ICICI Bank",
    "ifsc": "ICIC0007654",
    "status": "Completed",
    "reason": "",
    "createdAt": "2025-10-16 10:00 AM",
    "actions": ""
  },
  {
    "id": 17,
    "marketName": "Meena Reddy",
    "userPhone": "9866543210",
    "amount": 650,
    "payableAmount": 640,
    "requestType": "Withdraw",
    "withdrawMode": "UPI",
    "upiName": "Meena R",
    "upiID": "meena@ybl",
    "bankName": "SBI Bank",
    "ifsc": "SBIN0000567",
    "status": "Completed",
    "reason": "",
    "createdAt": "2025-10-15 11:45 AM",
    "actions": ""
  },
  {
    "id": 18,
    "marketName": "Rajesh Singh",
    "userPhone": "9822113344",
    "amount": 3000,
    "payableAmount": 2970,
    "requestType": "Withdraw",
    "withdrawMode": "Bank Transfer",
    "upiName": "Rajesh S",
    "upiID": "rajesh@hdfc",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000099",
    "status": "Completed",
    "reason": "",
    "createdAt": "2025-10-14 04:15 PM",
    "actions": ""
  },
  {
    "id": 19,
    "marketName": "Neha Chauhan",
    "userPhone": "9909988771",
    "amount": 2200,
    "payableAmount": 2175,
    "requestType": "Withdraw",
    "withdrawMode": "UPI",
    "upiName": "Neha C",
    "upiID": "neha@okhdfcbank",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0009876",
    "status": "Pending",
    "reason": "",
    "createdAt": "2025-10-13 09:10 PM",
    "actions": ""
  },
  {
    "id": 20,
    "marketName": "Arjun Pandey",
    "userPhone": "9888001122",
    "amount": 5600,
    "payableAmount": 5550,
    "requestType": "Deposit",
    "withdrawMode": "Bank Transfer",
    "upiName": "Arjun P",
    "upiID": "arjun@icici",
    "bankName": "ICICI Bank",
    "ifsc": "ICIC0000765",
    "status": "Completed",
    "reason": "",
    "createdAt": "2025-10-12 02:25 PM",
    "actions": ""
  }
]

