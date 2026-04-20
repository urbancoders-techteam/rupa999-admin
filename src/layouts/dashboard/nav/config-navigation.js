// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
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
        title: 'Main Market',
        path: PATH_DASHBOARD.markets.root,
        icon: ICONS.user,
        children: [
          { title: 'Market list', path: PATH_DASHBOARD.markets.marketlist.list },
          { title: 'Charts', path: PATH_DASHBOARD.markets.charts.list },
          { title: 'Records', path: PATH_DASHBOARD.markets.marketrecords.list },
          { title: 'market results', path: PATH_DASHBOARD.markets.marketresults.list },
          { title: 'Win History', path: PATH_DASHBOARD.markets.winhistory.list },
          { title: 'Data', path: PATH_DASHBOARD.markets.marketdata.list },
        ],
      },

      {
        title: 'star line markets',
        path: PATH_DASHBOARD.starline.root,
        icon: ICONS.user,
        children: [
          { title: 'Market list', path: PATH_DASHBOARD.starline.market.list },
          { title: 'Market Record', path: PATH_DASHBOARD.starline.marketrecords.list },
          { title: 'Game Result', path: PATH_DASHBOARD.starline.marketresults.list },
          { title: 'Win History', path: PATH_DASHBOARD.starline.winhistory.list },
          { title: 'Data', path: PATH_DASHBOARD.starline.marketdata.list },
        ],
      },
      {
        title: 'Transaction Details',
        path: PATH_DASHBOARD.maintransaction.list,
        icon: ICONS.banking,
      },

      {
        title: 'Bid History',
        path: PATH_DASHBOARD.mainbidhistory.list,
        icon: ICONS.banking,
      },
      {
        title: 'Withdraw History',
        path: PATH_DASHBOARD.generalwithdrawhistory.list,
        icon: ICONS.banking,
      },
      {
        title: 'Deposit History',
        path: PATH_DASHBOARD.diposithistory.list,
        icon: ICONS.banking,
      },
      { title: 'profits', path: PATH_DASHBOARD.profit.root, icon: ICONS.analytics },
      {
        title: 'Rate Card',
        path: PATH_DASHBOARD.ratecard.root,
        icon: ICONS.banking,
      },
      {
        title: 'staff',
        path: PATH_DASHBOARD.staff.root,
        icon: ICONS.user,
      },

      {
        title: 'settings',
        path: PATH_DASHBOARD.settings.root,
        icon: ICONS.setting,
        children: [
          {
            title: 'Notifications',
            path: PATH_DASHBOARD.notifications.list,
          },
          {
            title: 'FAQ',
            path: PATH_DASHBOARD.faq.list,
          },
          {
            title: 'Mobile App Marque',
            path: PATH_DASHBOARD.marquemessage.form,
          },
          { title: 'slider images', path: PATH_DASHBOARD.sliderimage.root },
          {
            title: 'Help and Support',
            path: PATH_DASHBOARD.helpsupport.form,
          },
          {
            title: 'Gateway Settings',
            path: PATH_DASHBOARD.gateway.form,
          },
          {
            title: 'Static Data',
            path: PATH_DASHBOARD.staticdata.form,
          },
          {
            title: 'Common Setting',
            path: PATH_DASHBOARD.commonsetting.form,
          },
        ],
      },
    ],
  },
];

export default navConfig;
