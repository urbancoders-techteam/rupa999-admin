// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
// import Label from '../../../components/label';
// import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  slider: icon('ic_slider'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  setting: icon('ic_setting'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Main',
    items: [
      { title: 'dashboard', path: PATH_DASHBOARD.home.root, icon: ICONS.dashboard },
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
      },
      {
        title: 'withdraw details',
        path: PATH_DASHBOARD.withdrawdetails.root,
        icon: ICONS.banking,
      },
      { title: 'profits', path: PATH_DASHBOARD.profit.root, icon: ICONS.analytics },

      {
        title: 'settings',
        path: PATH_DASHBOARD.settings.root,
        icon: ICONS.setting,
        children: [
          {
            title: 'change password',
            path: PATH_DASHBOARD.changepassword.form,
          },
          { title: 'slider images', path: PATH_DASHBOARD.sliderimage.root },
          {
            title: 'Help and Support',
            //  path: PATH_DASHBOARD.helpsupport.list
          },
        ],
      },

      { title: 'gift', path: PATH_DASHBOARD.gift.root, icon: ICONS.booking },

      {
        title: 'markets',
        path: PATH_DASHBOARD.markets.root,
        icon: ICONS.user,
        children: [
          { title: 'Market list', path: PATH_DASHBOARD.marketlist.list },
          { title: 'Pana Charts', path: PATH_DASHBOARD.panacharts.list },
          { title: 'General Market Records', path: PATH_DASHBOARD.marketrecords.list },
          { title: 'Previsous Results', path: PATH_DASHBOARD.previousresults.list },
          { title: 'General Predict Result', path: PATH_DASHBOARD.predictionform.form },
          { title: 'Win History', path: PATH_DASHBOARD.winhistory.list },
          { title: 'Data', path: PATH_DASHBOARD.marketrecords.list },
        ],
      },

      {
        title: 'Star Line Markets',
        path: PATH_DASHBOARD.markets.root,
        icon: ICONS.user,
        children: [
          { title: 'Market list', path: PATH_DASHBOARD.marketlist.list },
          { title: 'Pana Charts', path: PATH_DASHBOARD.panacharts.list },
          { title: 'General Market Records', path: PATH_DASHBOARD.marketrecords.list },
          { title: 'Previsous Results', path: PATH_DASHBOARD.previousresults.list },
          { title: 'General Predict Result', path: PATH_DASHBOARD.predictionform.form },
          { title: 'Win History', path: PATH_DASHBOARD.winhistory.list },
          { title: 'Data', path: PATH_DASHBOARD.marketrecords.list },
        ],
      },
      {
        title: 'General Withdraw History',
        path: PATH_DASHBOARD.generalwithdrawhistory.list,
        icon: ICONS.banking,
      },
      {
        title: 'Diposit History',
        path: PATH_DASHBOARD.diposithistory.list,
        icon: ICONS.banking,
      },
    ],
  },
];

export default navConfig;
