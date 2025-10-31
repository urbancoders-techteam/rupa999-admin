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
      { title: 'profits', path: PATH_DASHBOARD.profit.root, icon: ICONS.analytics },
      { title: 'slider image', path: PATH_DASHBOARD.sliderImage.root, icon: ICONS.slider },

      {
        title: 'users',
        path: PATH_DASHBOARD.users.root,
        icon: ICONS.user,
        children: [
          { title: 'user list', path: PATH_DASHBOARD.userlist.list },
          { title: 'withdraw details', path: PATH_DASHBOARD.withdrawdetails.list },
        ],
      },

      {
        title: 'settings',
        path: PATH_DASHBOARD.settings.root,
        icon: ICONS.setting,
        children: [
          {
            title: 'change password',
            path: PATH_DASHBOARD.changepassword.form,
          },
          {
            title: 'Help and Support',
            //  path: PATH_DASHBOARD.helpsupport.list
          },
        ],
      },

      { title: 'gift', path: PATH_DASHBOARD.gift.root, icon: ICONS.booking },
      // { title: 'gift', path: PATH_DASHBOARD.gift.root, icon: ICONS.booking },

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
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'management',
  //   items: [
  //     // USER
  //     {
  //       title: 'user',
  //       path: PATH_DASHBOARD.user.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'list', path: PATH_DASHBOARD.user.list },
  //       ],
  //     },

  //     // E-COMMERCE
  //     // {
  //     //   title: 'e-commerce',
  //     //   path: PATH_DASHBOARD.eCommerce.root,
  //     //   icon: ICONS.cart,
  //     //   children: [
  //     //     { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
  //     //     { title: 'create', path: PATH_DASHBOARD.eCommerce.new },
  //     //     { title: 'edit', path: PATH_DASHBOARD.eCommerce.demoEdit },
  //     //     { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
  //     //   ],
  //     // },

  //     // INVOICE
  //     // {
  //     //   title: 'invoice',
  //     //   path: PATH_DASHBOARD.invoice.root,
  //     //   icon: ICONS.invoice,
  //     //   children: [
  //     //     { title: 'list', path: PATH_DASHBOARD.invoice.list },
  //     //     { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
  //     //     { title: 'create', path: PATH_DASHBOARD.invoice.new },
  //     //     { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
  //     //   ],
  //     // },
  //   ],
  // },

  // DEMO MENU STATES
  // {
  //   subheader: 'Other cases',
  //   items: [

  //     // {
  //     //   title: 'menu_level',
  //     //   path: '#/dashboard/menu_level',
  //     //   icon: ICONS.menuItem,
  //     //   children: [
  //     //     {
  //     //       title: 'menu_level_2a',
  //     //       path: '#/dashboard/menu_level/menu_level_2a',
  //     //     },
  //     //     {
  //     //       title: 'menu_level_2b',
  //     //       path: '#/dashboard/menu_level/menu_level_2b',
  //     //       children: [
  //     //         {
  //     //           title: 'menu_level_3a',
  //     //           path: '#/dashboard/menu_level/menu_level_2b/menu_level_3a',
  //     //         },
  //     //         {
  //     //           title: 'menu_level_3b',
  //     //           path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b',
  //     //           children: [
  //     //             {
  //     //               title: 'menu_level_4a',
  //     //               path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4a',
  //     //             },
  //     //             {
  //     //               title: 'menu_level_4b',
  //     //               path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4b',
  //     //             },
  //     //           ],
  //     //         },
  //     //       ],
  //     //     },
  //     //   ],
  //     // },

  //     // {
  //     //   title: 'item_label',
  //     //   path: '#label',
  //     //   icon: ICONS.label,
  //     //   info: (
  //     //     <Label color="info" startIcon={<Iconify icon="eva:email-fill" />}>
  //     //       NEW
  //     //     </Label>
  //     //   ),
  //     // },

  //   ],
  // },
];

export default navConfig;
