import _mock from '../_mock';
import { randomNumberRange, randomInArray } from '../utils';

// ----------------------------------------------------------------------

export const _userAbout = {
  id: _mock.id(1),
  cover: _mock.image.cover(1),
  role: 'UI Designer',
  follower: randomNumberRange(999, 99999),
  following: randomNumberRange(999, 99999),
  quote:
    'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
  country: _mock.address.country(1),
  email: _mock.email(1),
  company: _mock.company(1),
  school: _mock.company(2),
  socialLinks: {
    facebookLink: `https://www.facebook.com/caitlyn.kerluke`,
    instagramLink: `https://www.instagram.com/caitlyn.kerluke`,
    linkedinLink: `https://www.linkedin.com/in/caitlyn.kerluke`,
    twitterLink: `https://www.twitter.com/caitlyn.kerluke`,
  },
};

export const _userFollowers = [...Array(18)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: _mock.image.avatar(index),
  name: _mock.name.fullName(index),
  country: _mock.address.country(index),
  isFollowed: _mock.boolean(index),
}));

export const _userFriends = [...Array(18)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: _mock.image.avatar(index),
  name: _mock.name.fullName(index),
  role: _mock.role(index),
}));

export const _userGallery = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.text.title(index),
  postAt: _mock.time(index),
  imageUrl: _mock.image.cover(index),
}));

export const _userFeeds = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  author: {
    id: _mock.id(8),
    avatarUrl: _mock.image.avatar(1),
    name: 'Caitlyn Kerluke',
  },
  isLiked: true,
  createdAt: _mock.time(index),
  media: _mock.image.cover(index),
  message: _mock.text.sentence(index),
  personLikes: [...Array(36)].map((__, personIndex) => ({
    name: _mock.name.fullName(personIndex),
    avatarUrl: _mock.image.avatar(personIndex + 2),
  })),
  comments: (index === 2 && []) || [
    {
      id: _mock.id(7),
      author: {
        id: _mock.id(8),
        avatarUrl: _mock.image.avatar(randomInArray([2, 3, 4, 5, 6]) || 2),
        name: _mock.name.fullName(index + 5),
      },
      createdAt: _mock.time(2),
      message: 'Praesent venenatis metus at',
    },
    {
      id: _mock.id(9),
      author: {
        id: _mock.id(10),
        avatarUrl: _mock.image.avatar(randomInArray([7, 8, 9, 10, 11]) || 7),
        name: _mock.name.fullName(index + 6),
      },
      createdAt: _mock.time(3),
      message:
        'Etiam rhoncus. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed lectus.',
    },
  ],
}));

export const _userCards = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: _mock.image.avatar(index),
  cover: _mock.image.cover(index),
  name: _mock.name.fullName(index),
  follower: randomNumberRange(999, 99999),
  following: randomNumberRange(999, 99999),
  totalPosts: randomNumberRange(999, 99999),
  role: _mock.role(index),
}));

export const _userPayment = [...Array(2)].map((_, index) => ({
  id: _mock.id(index),
  cardNumber: ['**** **** **** 1234', '**** **** **** 5678', '**** **** **** 7878'][index],
  cardType: ['master_card', 'visa', 'master_card'][index],
}));

export const _userAddressBook = [...Array(4)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  phone: _mock.phoneNumber(index),
  country: _mock.address.country(index),
  state: 'New Hampshire',
  city: 'East Sambury',
  street: '41256 Kamille Turnpike',
  zipCode: '85807',
}));

export const _userInvoices = [...Array(10)].map((_, index) => ({
  id: _mock.id(index),
  createdAt: _mock.time(index),
  price: _mock.number.price(index),
}));

export const _userList = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: _mock.image.avatar(index),
  name: _mock.name.fullName(index),
  email: _mock.email(index),
  phoneNumber: _mock.phoneNumber(index),
  address: '908 Jack Locks',
  country: _mock.address.country(index),
  state: 'Virginia',
  upi: 'dummyupi@ybl',
  city: 'Rancho Cordova',
  zipCode: '85807',
  company: _mock.company(index),
  isVerified: _mock.boolean(index),
  status: randomInArray(['active', 'banned']),
  role: _mock.role(index),
}));

export const _userDataList = [
  {
    "id": 1,
    "name": "Rahul Mehta",
    "phone": "9876543210",
    "password": "rahul@123",
    "balance": 4500,
    "totalGameAmt": 20000,
    "totalWon": 12000,
    "totalWithdraw": 8000,
    "totalBonus": 500,
    "status": "Active",
    "createdAt": "2025-09-12 10:15 AM"
  },
  {
    "id": 2,
    "name": "Priya Sharma",
    "phone": "9123456789",
    "password": "priya@789",
    "balance": 3100,
    "totalGameAmt": 15000,
    "totalWon": 7000,
    "totalWithdraw": 6000,
    "totalBonus": 400,
    "status": "Active",
    "createdAt": "2025-09-18 03:45 PM"
  },
  {
    "id": 3,
    "name": "Amit Singh",
    "phone": "9812345678",
    "password": "amit@456",
    "balance": 5200,
    "totalGameAmt": 22000,
    "totalWon": 13000,
    "totalWithdraw": 9000,
    "totalBonus": 700,
    "status": "Blocked",
    "createdAt": "2025-08-22 11:10 AM"
  },
  {
    "id": 4,
    "name": "Neha Patel",
    "phone": "9955123498",
    "password": "neha@789",
    "balance": 2700,
    "totalGameAmt": 12000,
    "totalWon": 5000,
    "totalWithdraw": 4000,
    "totalBonus": 300,
    "status": "Active",
    "createdAt": "2025-09-25 04:05 PM"
  },
  {
    "id": 5,
    "name": "Arjun Verma",
    "phone": "9822221144",
    "password": "arjun@007",
    "balance": 6000,
    "totalGameAmt": 25000,
    "totalWon": 15000,
    "totalWithdraw": 10000,
    "totalBonus": 900,
    "status": "Blocked",
    "createdAt": "2025-10-02 09:40 AM"
  },
  {
    "id": 6,
    "name": "Sneha Gupta",
    "phone": "9933445566",
    "password": "sneha@123",
    "balance": 4200,
    "totalGameAmt": 18000,
    "totalWon": 11000,
    "totalWithdraw": 7000,
    "totalBonus": 500,
    "status": "Active",
    "createdAt": "2025-09-28 06:25 PM"
  },
  {
    "id": 7,
    "name": "Rohit Yadav",
    "phone": "9786543210",
    "password": "rohit@654",
    "balance": 3900,
    "totalGameAmt": 16000,
    "totalWon": 8000,
    "totalWithdraw": 7000,
    "totalBonus": 600,
    "status": "Active",
    "createdAt": "2025-09-14 02:20 PM"
  },
  {
    "id": 8,
    "name": "Kiran Nair",
    "phone": "9798123456",
    "password": "kiran@999",
    "balance": 3100,
    "totalGameAmt": 14000,
    "totalWon": 7000,
    "totalWithdraw": 5000,
    "totalBonus": 400,
    "status": "Blocked",
    "createdAt": "2025-09-30 12:10 PM"
  },
  {
    "id": 9,
    "name": "Manish Pandey",
    "phone": "9823456712",
    "password": "manish@555",
    "balance": 4700,
    "totalGameAmt": 19000,
    "totalWon": 10000,
    "totalWithdraw": 8000,
    "totalBonus": 450,
    "status": "Active",
    "createdAt": "2025-10-10 08:00 PM"
  },
  {
    "id": 10,
    "name": "Ritika Jain",
    "phone": "9966123450",
    "password": "ritika@111",
    "balance": 3400,
    "totalGameAmt": 13000,
    "totalWon": 6000,
    "totalWithdraw": 5000,
    "totalBonus": 300,
    "status": "Blocked",
    "createdAt": "2025-09-21 03:55 PM"
  },
  {
    "id": 11,
    "name": "Aditya Kumar",
    "phone": "9899001122",
    "password": "aditya@222",
    "balance": 5600,
    "totalGameAmt": 21000,
    "totalWon": 13000,
    "totalWithdraw": 9000,
    "totalBonus": 600,
    "status": "Active",
    "createdAt": "2025-09-08 01:30 PM"
  },
  {
    "id": 12,
    "name": "Simran Kaur",
    "phone": "9876123499",
    "password": "simran@555",
    "balance": 2900,
    "totalGameAmt": 12000,
    "totalWon": 5000,
    "totalWithdraw": 4000,
    "totalBonus": 300,
    "status": "Blocked",
    "createdAt": "2025-08-30 11:15 AM"
  },
  {
    "id": 13,
    "name": "Varun Sharma",
    "phone": "9811122233",
    "password": "varun@888",
    "balance": 6100,
    "totalGameAmt": 26000,
    "totalWon": 15000,
    "totalWithdraw": 10000,
    "totalBonus": 900,
    "status": "Active",
    "createdAt": "2025-10-05 05:45 PM"
  },
  {
    "id": 14,
    "name": "Deepika Joshi",
    "phone": "9722345678",
    "password": "deepika@444",
    "balance": 3300,
    "totalGameAmt": 14000,
    "totalWon": 7000,
    "totalWithdraw": 5000,
    "totalBonus": 400,
    "status": "Blocked",
    "createdAt": "2025-09-23 07:20 PM"
  },
  {
    "id": 15,
    "name": "Nikhil Chauhan",
    "phone": "9998887776",
    "password": "nikhil@555",
    "balance": 4800,
    "totalGameAmt": 19000,
    "totalWon": 11000,
    "totalWithdraw": 7000,
    "totalBonus": 500,
    "status": "Active",
    "createdAt": "2025-09-19 02:40 PM"
  },
  {
    "id": 16,
    "name": "Tanya Kapoor",
    "phone": "9855123478",
    "password": "tanya@123",
    "balance": 2600,
    "totalGameAmt": 11000,
    "totalWon": 4000,
    "totalWithdraw": 3000,
    "totalBonus": 250,
    "status": "Active",
    "createdAt": "2025-09-10 09:30 AM"
  },
  {
    "id": 17,
    "name": "Vivek Soni",
    "phone": "9911223344",
    "password": "vivek@111",
    "balance": 5100,
    "totalGameAmt": 22000,
    "totalWon": 12000,
    "totalWithdraw": 9000,
    "totalBonus": 650,
    "status": "Active",
    "createdAt": "2025-10-01 06:50 PM"
  },
  {
    "id": 18,
    "name": "Renu Mishra",
    "phone": "9777888999",
    "password": "renu@222",
    "balance": 3700,
    "totalGameAmt": 16000,
    "totalWon": 7000,
    "totalWithdraw": 6000,
    "totalBonus": 350,
    "status": "Blocked",
    "createdAt": "2025-09-16 01:25 PM"
  },
  {
    "id": 19,
    "name": "Saurabh Patel",
    "phone": "9766112233",
    "password": "saurabh@999",
    "balance": 5900,
    "totalGameAmt": 24000,
    "totalWon": 14000,
    "totalWithdraw": 9500,
    "totalBonus": 700,
    "status": "Active",
    "createdAt": "2025-09-26 03:15 PM"
  },
  {
    "id": 20,
    "name": "Meera Desai",
    "phone": "9811556677",
    "password": "meera@555",
    "balance": 3000,
    "totalGameAmt": 13000,
    "totalWon": 6000,
    "totalWithdraw": 5000,
    "totalBonus": 300,
    "status": "Active",
    "createdAt": "2025-09-29 10:50 AM"
  }
]


