import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// services
import { getPendingWithdrawalCountAsync } from '../redux/services/withdrawal_services';
// utils
import { hasNavViewPermission } from '../utils/navPermissions';

// ----------------------------------------------------------------------

// How often the badge re-checks for newly raised withdrawal requests.
const POLL_INTERVAL = 60 * 1000;

// Number of withdrawal requests still awaiting a decision, kept fresh for the
// sidebar badge. Only polls when the admin can actually open Withdraw History -
// otherwise the request would 403 and pop an error toast on every tick.
export default function usePendingWithdrawCount() {
  const dispatch = useDispatch();

  const { admin } = useSelector((state) => state.auth);
  const { permissions } = useSelector((state) => state.permission);
  const { pendingCount } = useSelector((state) => state.withdrawal);

  const canView = hasNavViewPermission('Withdraw History', {
    isSuperAdmin: admin?.isSuperAdmin,
    permissions,
  });

  const refresh = useCallback(() => {
    dispatch(getPendingWithdrawalCountAsync());
  }, [dispatch]);

  useEffect(() => {
    if (!canView) return undefined;

    refresh();

    const timer = setInterval(refresh, POLL_INTERVAL);

    // A tab sitting in the background can go stale for a long time, so re-check
    // the moment it's looked at again.
    window.addEventListener('focus', refresh);

    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, [canView, refresh]);

  return canView ? pendingCount : 0;
}
