import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { MenuItem } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_AUTH } from '../../../routes/paths';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import { useSnackbar } from '../../../components/snackbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

// const OPTIONS = [
//   {
//     label: 'Home',
//     linkTo: '/',
//   },
//   // {
//   //   label: 'Profile',
//   //   linkTo: PATH_DASHBOARD.user.profile,
//   // },
//   // {
//   //   label: 'Settings',
//   //   linkTo: PATH_DASHBOARD.user.account,
//   // },
// ];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const { user, logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    try {
      // logout();
      localStorage.removeItem('token');
      // window.location.href = PATH_AUTH.login;
      navigate(PATH_AUTH.login, { replace: true });
      handleClosePopover();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleChangePassword = () => {
    navigate(PATH_DASHBOARD.changepassword.form);
    handleClosePopover();
  };


  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <CustomAvatar src={user?.photoURL} alt={user?.displayName} name={user?.displayName || "Admin"} />
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>

        <MenuItem onClick={handleLogout} sx={{ m: 1 , display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
          Logout
          <Iconify icon="mdi:logout" />
        </MenuItem>
        <MenuItem onClick={handleChangePassword} sx={{ m: 1 , display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
          Change Password
          <Iconify icon="mdi:lock-reset" />
        </MenuItem>
      </MenuPopover>
    </>
  );
}
