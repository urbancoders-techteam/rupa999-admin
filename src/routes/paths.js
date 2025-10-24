// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  home: {
    root: path(ROOTS_DASHBOARD, '/home'),
  },
  // dashboard: {
  //   root: path(ROOTS_DASHBOARD, '/dashboard'),
  // },
  sliderImage: {
    root: path(ROOTS_DASHBOARD, '/slider-image'),
  },
  // general: {
  //   home: path(ROOTS_DASHBOARD, '/home'),
  //   sliderImage: path(ROOTS_DASHBOARD, '/slider-image'),
  //   analytics: path(ROOTS_DASHBOARD, '/analytics'),
  // },
  users: {
    root: path(ROOTS_DASHBOARD, '/users'),
  },
  userlist: {
    root: path(ROOTS_DASHBOARD, '/users/userlist'),
    list: path(ROOTS_DASHBOARD, '/users/userlist/list'),
    // new: path(ROOTS_DASHBOARD, '/userlist/new'),
    // account: path(ROOTS_DASHBOARD, '/userlist/account'),
    // edit: (name) => path(ROOTS_DASHBOARD, `/userlist/${name}/edit`),
  },
  withdrawdetails: {
    root: path(ROOTS_DASHBOARD, '/users/withdrawdetails'),
    list: path(ROOTS_DASHBOARD, '/users/withdrawdetails/list'),
  },

  profit: {
    root: path(ROOTS_DASHBOARD, '/profit'),
    // all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  // eCommerce: {
  //   root: path(ROOTS_DASHBOARD, '/e-commerce'),
  //   list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
  //   checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
  //   view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
  //   edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
  //   demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
  //   demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  // },
  // invoice: {
  //   root: path(ROOTS_DASHBOARD, '/invoice'),
  //   list: path(ROOTS_DASHBOARD, '/invoice/list'),
  //   new: path(ROOTS_DASHBOARD, '/invoice/new'),
  //   view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
  //   demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
  //   demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  // },
  // blog: {
  //   root: path(ROOTS_DASHBOARD, '/blog'),
  //   posts: path(ROOTS_DASHBOARD, '/blog/posts'),
  //   new: path(ROOTS_DASHBOARD, '/blog/new'),
  //   view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
  //   demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  // },
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';

export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1';
