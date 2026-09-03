// Top-level nav sections that don't map to a permission-gated backend Route -
// always visible regardless of the staff's Designation permissions.
const ALWAYS_VISIBLE_TITLES = new Set(['dashboard', 'profits']);

const normalize = (title) => (title || '').toLowerCase().trim();

// Whether a staff member's Designation grants "view" on the backend Route
// behind a nav item (super admins always see everything).
export function hasNavViewPermission(title, { isSuperAdmin, permissions }) {
  if (isSuperAdmin || ALWAYS_VISIBLE_TITLES.has(normalize(title))) {
    return true;
  }

  return (permissions || []).some(
    (permission) => permission?.view && normalize(permission?.title) === normalize(title)
  );
}

// Hides sidebar items a staff member's Designation doesn't have "view"
// permission for, so the menu matches what the backend will actually let
// them open.
export function filterNavConfigByPermission(navConfig, { isSuperAdmin, permissions }) {
  if (isSuperAdmin || !Array.isArray(navConfig)) {
    return navConfig;
  }

  const canView = (title) => hasNavViewPermission(title, { isSuperAdmin, permissions });

  return navConfig
    .map((section) => ({
      ...section,
      items: (section.items || []).filter((item) => canView(item.title)),
    }))
    .filter((section) => section.items.length > 0);
}
