import { useMemo } from 'react';
import { useSelector } from 'react-redux';
// @mui
import { Stack, Box } from '@mui/material';
// config
import { NAV } from '../../../config-global';
// utils
import { hideScrollbarX } from '../../../utils/cssStyles';
import { filterNavConfigByPermission } from '../../../utils/navPermissions';
// components
import Logo from '../../../components/logo';
import { NavSectionMini } from '../../../components/nav-section';
//
import navConfig from './config-navigation';
import NavToggleButton from './NavToggleButton';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { admin } = useSelector((state) => state.auth);
  const { permissions } = useSelector((state) => state.permission);

  const filteredNavConfig = useMemo(
    () => filterNavConfigByPermission(navConfig, { isSuperAdmin: admin?.isSuperAdmin, permissions }),
    [admin?.isSuperAdmin, permissions]
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_DASHBOARD_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_DASHBOARD_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScrollbarX,
        }}
      >
        <Logo sx={{ mx: 'auto', my: 2 }} />

        <NavSectionMini data={filteredNavConfig} />
      </Stack>
    </Box>
  );
}
