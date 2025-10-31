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
  sliderImage: {
    root: path(ROOTS_DASHBOARD, '/slider-image'),
  },

  users: {
    root: path(ROOTS_DASHBOARD, '/users'),
  },
  userlist: {
    root: path(ROOTS_DASHBOARD, '/users/userlist'),
    list: path(ROOTS_DASHBOARD, '/users/userlist/list'),
    // new: path(ROOTS_DASHBOARD, '/user/new'),
    // edit: (id) => path(ROOTS_DASHBOARD, `/user/${id}/edit`),
    // view: (id) => path(ROOTS_DASHBOARD, `/user/${id}/view`),
  },
  withdrawdetails: {
    root: path(ROOTS_DASHBOARD, '/users/withdrawdetails'),
    list: path(ROOTS_DASHBOARD, '/users/withdrawdetails/list'),
  },

  profit: {
    root: path(ROOTS_DASHBOARD, '/profit'),
    // all: path(ROOTS_DASHBOARD, '/mail/all'),
  },

  // General Settings
  settings: {
    root: path(ROOTS_DASHBOARD, '/settings'),
  },

  changepassword: {
    root: path(ROOTS_DASHBOARD, '/settings/changepassword'),
    form: path(ROOTS_DASHBOARD, '/settings/changepassword/form'),
  },

  gift: {
    root: path(ROOTS_DASHBOARD, '/gift'),
    list: path(ROOTS_DASHBOARD, '/gift/list'),
    new: path(ROOTS_DASHBOARD, '/gift/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/gift/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/gift/${id}/view`),
  },

  markets: {
    root: path(ROOTS_DASHBOARD, '/markets'),
  },
  marketlist: {
    root: path(ROOTS_DASHBOARD, '/markets/marketlist'),
    list: path(ROOTS_DASHBOARD, '/markets/marketlist/list'),
    new: path(ROOTS_DASHBOARD, '/markets/marketlist/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/markets/marketlist/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/markets/marketlist/${id}/view`),
  },
  panacharts: {
    root: path(ROOTS_DASHBOARD, '/markets/panacharts'),
    list: path(ROOTS_DASHBOARD, '/markets/panacharts/list'),
    // new: path(ROOTS_DASHBOARD, '/markets/panacharts/new'),
    // edit: (id) => path(ROOTS_DASHBOARD, `/markets/panacharts/${id}/edit`),
    // view: (id) => path(ROOTS_DASHBOARD, `/markets/panacharts/${id}/view`),
  },
  marketrecords: {
    root: path(ROOTS_DASHBOARD, '/markets/marketrecords'),
    list: path(ROOTS_DASHBOARD, '/markets/marketrecords/list'),
    // new: path(ROOTS_DASHBOARD, '/markets/marketrecords/new'),
    // edit: (id) => path(ROOTS_DASHBOARD, `/markets/marketrecords/${id}/edit`),
    // view: (id) => path(ROOTS_DASHBOARD, `/markets/marketrecords/${id}/view`),
  },
  previousresults: {
    root: path(ROOTS_DASHBOARD, '/markets/previousresults'),
    list: path(ROOTS_DASHBOARD, '/markets/previousresults/list'),
    // new: path(ROOTS_DASHBOARD, '/markets/previousresults/new'),
    // edit: (id) => path(ROOTS_DASHBOARD, `/markets/previousresults/${id}/edit`),
    // view: (id) => path(ROOTS_DASHBOARD, `/markets/previousresults/${id}/view`),
  },
  predictionform: {
    root: path(ROOTS_DASHBOARD, '/markets/predictionform'),
    form: path(ROOTS_DASHBOARD, '/markets/predictionform/form'),
  },
  winhistory: {
    root: path(ROOTS_DASHBOARD, '/markets/winhistory'),
    list: path(ROOTS_DASHBOARD, '/markets/winhistory/list'),
  },
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';

export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1';
