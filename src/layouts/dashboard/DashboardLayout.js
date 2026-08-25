import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Box } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import { useSettingsContext } from '../../components/settings';
//
import { restoreAdminFromStorage } from '../../redux/slices/auth_slices';
import { getPermissionByRoleIdAsync } from '../../redux/services/auth_role_permission';
import Main from './Main';
import Header from './header';
import NavMini from './nav/NavMini';
import NavVertical from './nav/NavVertical';
import NavHorizontal from './nav/NavHorizontal';

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { themeLayout } = useSettingsContext();

  const isDesktop = useResponsive('up', 'lg');

  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.auth);
  const { permissions } = useSelector((state) => state.permission);

  // Redux auth/permission state isn't persisted, so a page reload loses
  // isSuperAdmin/roleId and the sidebar permission filter (see NavVertical
  // etc.) would otherwise hide everything for a logged-in staff member, or
  // wrongly treat a super admin as restricted. Rehydrate from the durable
  // localStorage session on first mount.
  useEffect(() => {
    if (admin?._id) return; // already have it (e.g. fresh login in this session)

    const stored = localStorage.getItem('admin');
    if (!stored) return;

    try {
      const parsedAdmin = JSON.parse(stored);
      dispatch(restoreAdminFromStorage(parsedAdmin));

      const roleIdValue = parsedAdmin?.roleId?._id || parsedAdmin?.roleId;
      if (!parsedAdmin?.isSuperAdmin && roleIdValue && permissions.length === 0) {
        dispatch(getPermissionByRoleIdAsync(roleIdValue));
      }
    } catch (error) {
      // Malformed/stale localStorage value - ignore, user stays logged out of the filtered nav
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [open, setOpen] = useState(false);

  const isNavHorizontal = themeLayout === 'horizontal';

  const isNavMini = themeLayout === 'mini';

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderNavVertical = <NavVertical openNav={open} onCloseNav={handleClose} />;

  if (isNavHorizontal) {
    return (
      <>
        <Header onOpenNav={handleOpen} />

        {isDesktop ? <NavHorizontal /> : renderNavVertical}

        <Main>
          <Outlet />
        </Main>
      </>
    );
  }

  if (isNavMini) {
    return (
      <>
        <Header onOpenNav={handleOpen} />

        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
          }}
        >
          {isDesktop ? <NavMini /> : renderNavVertical}

          <Main>
            <Outlet />
          </Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={handleOpen} />

      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 },
        }}
      >
        {renderNavVertical}

        <Main>
          <Outlet />
        </Main>
      </Box>
    </>
  );
}
