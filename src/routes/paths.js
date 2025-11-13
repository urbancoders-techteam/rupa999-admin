function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

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

  staff: {
    root: path(ROOTS_DASHBOARD, '/staff'),
    list: path(ROOTS_DASHBOARD, '/staff/list'),
    new: path(ROOTS_DASHBOARD, '/staff/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/staff/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/staff/${id}/view`),
  },

  designation: {
    root: path(ROOTS_DASHBOARD, '/designation'),
    list: path(ROOTS_DASHBOARD, '/designation/list'),
    new: path(ROOTS_DASHBOARD, '/designation/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/designation/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/designation/${id}/view`),
  },

  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/user/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/user/${id}/view`),
    transactions: (id) => path(ROOTS_DASHBOARD, `/user/${id}/transactions`),
    bidhistory: (id) => path(ROOTS_DASHBOARD, `/user/${id}/bidhistory`),
    withdrawalrequest: (id) => path(ROOTS_DASHBOARD, `/user/${id}/withdrawalrequest`),
  },

  withdrawdetails: {
    root: path(ROOTS_DASHBOARD, '/withdrawdetails'),
    list: path(ROOTS_DASHBOARD, '/withdrawdetails/list'),
  },

  profit: {
    root: path(ROOTS_DASHBOARD, '/profit'),
  },

  // -------------------------- General Settings --------------------------
  settings: {
    root: path(ROOTS_DASHBOARD, '/settings'),
  },
  changepassword: {
    root: path(ROOTS_DASHBOARD, '/settings/changepassword'),
    form: path(ROOTS_DASHBOARD, '/settings/changepassword/form'),
  },
  sliderimage: {
    root: path(ROOTS_DASHBOARD, '/settings/sliderimage'),
    form: path(ROOTS_DASHBOARD, '/settings/sliderimage/form'),
  },

  gift: {
    root: path(ROOTS_DASHBOARD, '/gift'),
    list: path(ROOTS_DASHBOARD, '/gift/list'),
    new: path(ROOTS_DASHBOARD, '/gift/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/gift/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/gift/${id}/view`),
  },

  // -------------------------- Markets (General) --------------------------
  markets: {
    root: path(ROOTS_DASHBOARD, '/markets'),

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
    },

    marketrecords: {
      root: path(ROOTS_DASHBOARD, '/markets/marketrecords'),
      list: path(ROOTS_DASHBOARD, '/markets/marketrecords/list'),
    },

    marketresults: {
      root: path(ROOTS_DASHBOARD, '/markets/marketresults'),
      list: path(ROOTS_DASHBOARD, '/markets/marketresults/list'),
    },

    predictionform: {
      root: path(ROOTS_DASHBOARD, '/markets/predictionform'),
      form: path(ROOTS_DASHBOARD, '/markets/predictionform/form'),
    },

    winhistory: {
      root: path(ROOTS_DASHBOARD, '/markets/winhistory'),
      list: path(ROOTS_DASHBOARD, '/markets/winhistory/list'),
    },
  },

  // -------------------------- Starline Market --------------------------
  starline: {
    root: path(ROOTS_DASHBOARD, '/starline'),

    market: {
      root: path(ROOTS_DASHBOARD, '/starline/market'),
      list: path(ROOTS_DASHBOARD, '/starline/market/list'),
      new: path(ROOTS_DASHBOARD, '/starline/market/new'),
      edit: (id) => path(ROOTS_DASHBOARD, `/starline/market/${id}/edit`),
      view: (id) => path(ROOTS_DASHBOARD, `/starline/market/${id}/view`),
    },

    marketrecords: {
      root: path(ROOTS_DASHBOARD, '/starline/marketrecords'),
      list: path(ROOTS_DASHBOARD, '/starline/marketrecords/list'),
    },

    marketresults: {
      root: path(ROOTS_DASHBOARD, '/starline/marketresults'),
      list: path(ROOTS_DASHBOARD, '/starline/marketresults/list'),
    },

    winhistory: {
      root: path(ROOTS_DASHBOARD, '/starline/winhistory'),
      list: path(ROOTS_DASHBOARD, '/starline/winhistory/list'),
    },
  },

  generalwithdrawhistory: {
    root: path(ROOTS_DASHBOARD, '/generalwithdrawhistory'),
    list: path(ROOTS_DASHBOARD, '/generalwithdrawhistory/list'),
  },

  diposithistory: {
    root: path(ROOTS_DASHBOARD, '/diposithistory'),
    list: path(ROOTS_DASHBOARD, '/diposithistory/list'),
  },

  gametypes: {
    root: path(ROOTS_DASHBOARD, '/gametypes'),
  },
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';
export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';
export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';
export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1';
