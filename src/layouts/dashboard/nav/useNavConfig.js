import { useMemo } from 'react';
import { useSelector } from 'react-redux';
// components
import Label from '../../../components/label';
// hooks
import usePendingWithdrawCount from '../../../hooks/usePendingWithdrawCount';
// utils
import { filterNavConfigByPermission } from '../../../utils/navPermissions';
//
import navConfig from './config-navigation';

// ----------------------------------------------------------------------

// The nav config the dashboard layouts actually render: items the staff
// member's Designation can't view are dropped, and live counters are attached
// as item badges.
export default function useNavConfig() {
  const { admin } = useSelector((state) => state.auth);
  const { permissions } = useSelector((state) => state.permission);

  const pendingWithdrawCount = usePendingWithdrawCount();

  return useMemo(() => {
    const filtered = filterNavConfigByPermission(navConfig, {
      isSuperAdmin: admin?.isSuperAdmin,
      permissions,
    });

    if (!pendingWithdrawCount) {
      return filtered;
    }

    const badge = (
      <Label
        color="error"
        variant="filled"
        sx={{ height: 20, minWidth: 20, px: 0.5, borderRadius: '10px', fontSize: 11 }}
      >
        {pendingWithdrawCount > 99 ? '99+' : pendingWithdrawCount}
      </Label>
    );

    return filtered.map((section) => ({
      ...section,
      items: (section.items || []).map((item) =>
        item.title === 'Withdraw History' ? { ...item, info: badge } : item
      ),
    }));
  }, [admin?.isSuperAdmin, permissions, pendingWithdrawCount]);
}
