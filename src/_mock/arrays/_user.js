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
    "ID": 368,
    "Name": "yyyy",
    "AccountHolderName": "Gayatri Bai",
    "UpiName": "gayatribai@ybl",
    "AccountNumber": "42992537805",
    "AccountIFSCCode": "SBIN0004910",
    "UPID": "gayatribai@ybl",
    "CreatedAt": "2025-10-18 10:56:28"
  },
  {
    "ID": 382,
    "Name": "yorakash",
    "AccountHolderName": "T Prakash",
    "UpiName": "tprakash@okaxis",
    "AccountNumber": "24218100004502",
    "AccountIFSCCode": "BARB0KURNUL",
    "UPID": "tprakash@okaxis",
    "CreatedAt": "2025-10-23 10:57:44"
  },
  {
    "ID": 386,
    "Name": "Yalla Naidu",
    "AccountHolderName": "Yalla Naidu",
    "UpiName": "yallanaidu@okicici",
    "AccountNumber": "110092824641",
    "AccountIFSCCode": "CNRB0000033",
    "UPID": "yallanaidu@okicici",
    "CreatedAt": "2025-10-26 07:10:37"
  },
  {
    "ID": 374,
    "Name": "Solzar",
    "AccountHolderName": "Shabina Ashadaalla Yaragal",
    "UpiName": "shabina@ybl",
    "AccountNumber": "52500101498401",
    "AccountIFSCCode": "KARB0000005",
    "UPID": "shabina@ybl",
    "CreatedAt": "2025-10-19 11:34:14"
  },
  {
    "ID": 373,
    "Name": "Shubham Kumar",
    "AccountHolderName": "Shubham Anil Taywade",
    "UpiName": "shubhamtaywade@oksbi",
    "AccountNumber": "35320769212",
    "AccountIFSCCode": "SBIN0003898",
    "UPID": "shubhamtaywade@oksbi",
    "CreatedAt": "2025-10-19 11:28:04"
  },
  {
    "ID": 361,
    "Name": "Shameer",
    "AccountHolderName": "Mohomaad Shameer P",
    "UpiName": "shameerp@okaxis",
    "AccountNumber": "82001008428",
    "AccountIFSCCode": "ICIC00VSCBL",
    "UPID": "shameerp@okaxis",
    "CreatedAt": "2025-10-16 16:30:26"
  },
  {
    "ID": 380,
    "Name": "Sandeep",
    "AccountHolderName": "Sandeep Y T",
    "UpiName": "sandeepyt@ybl",
    "AccountNumber": "110007485384",
    "AccountIFSCCode": "CNRB0000573",
    "UPID": "7259361638@ibl",
    "CreatedAt": "2025-10-21 16:22:46"
  },
  {
    "ID": 366,
    "Name": "Sameer",
    "AccountHolderName": "Sameer Tiwari",
    "UpiName": "sameertiwari@oksbi",
    "AccountNumber": "115007428593",
    "AccountIFSCCode": "SBIN0007215",
    "UPID": "7000712812-3@ybl",
    "CreatedAt": "2025-10-18 00:17:27"
  },
  {
    "ID": 369,
    "Name": "Sagar",
    "AccountHolderName": "Aryan",
    "UpiName": "aryan@okhdfc",
    "AccountNumber": "31838100042610",
    "AccountIFSCCode": "BARB0SARRAI",
    "UPID": "aryanjangde123@ybl",
    "CreatedAt": "2025-10-18 12:08:15"
  },
  {
    "ID": 376,
    "Name": "Sabita Mundu",
    "AccountHolderName": "Sabita Mundu",
    "UpiName": "sabitamundu@ybl",
    "AccountNumber": "31974159790",
    "AccountIFSCCode": "SBIN0008445",
    "UPID": "sabitamundu@ybl",
    "CreatedAt": "2025-10-19 19:57:09"
  },
  {
    "ID": 362,
    "Name": "RK Ramakrishna",
    "AccountHolderName": "Appecherla Ramakrishna",
    "UpiName": "appecherlaRamakrishna@okicici",
    "AccountNumber": "1310100163403",
    "AccountIFSCCode": "UBIN0800139",
    "UPID": "krama52501@ybl",
    "CreatedAt": "2025-10-16 18:16:21"
  },
  {
    "ID": 378,
    "Name": "Rayananitha",
    "AccountHolderName": "Anitha Rayan",
    "UpiName": "anitharayan@oksbi",
    "AccountNumber": "924010006446473",
    "AccountIFSCCode": "UTIB0004056",
    "UPID": "300@ybl",
    "CreatedAt": "2025-10-20 08:23:57"
  },
  {
    "ID": 364,
    "Name": "Rahul",
    "AccountHolderName": "Rahul Kadam",
    "UpiName": "rahulkadam@ybl",
    "AccountNumber": "3450836114",
    "AccountIFSCCode": "SBIN016667",
    "UPID": "9552530358@ybl",
    "CreatedAt": "2025-10-17 16:35:06"
  },
  {
    "ID": 379,
    "Name": "Pruthvi",
    "AccountHolderName": "Prithviraj In Oo To",
    "UpiName": "pruthviraj@okaxis",
    "AccountNumber": "9676315003",
    "AccountIFSCCode": "AIRP0000001",
    "UPID": "kpruthvi7@ybl",
    "CreatedAt": "2025-10-20 19:48:26"
  },
  {
    "ID": 385,
    "Name": "Prafulla Sa",
    "AccountHolderName": "Prafulla Sa",
    "UpiName": "prafullasa@oksbi",
    "AccountNumber": "40028129072",
    "AccountIFSCCode": "SBIN0006128",
    "UPID": "9337192931@ybi",
    "CreatedAt": "2025-10-19 13:06:12"
  },
  {
    "ID": 384,
    "Name": "P Sreenath",
    "AccountHolderName": "P Sreenath",
    "UpiName": "psreenath@ybl",
    "AccountNumber": "565410110014668",
    "AccountIFSCCode": "BKID0005654",
    "UPID": "psreenath@ybl",
    "CreatedAt": "2025-10-24 13:08:33"
  },
  {
    "ID": 383,
    "Name": "Mubarak",
    "AccountHolderName": "Mubarak Jundre",
    "UpiName": "mubarakj@okaxis",
    "AccountNumber": "60142063744",
    "AccountIFSCCode": "MAHB0000724",
    "UPID": "mubarakj@okaxis",
    "CreatedAt": "2025-10-23 21:21:10"
  }
]

