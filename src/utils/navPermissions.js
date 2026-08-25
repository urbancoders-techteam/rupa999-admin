// Top-level nav sections that don't map to a permission-gated backend Route -
// always visible regardless of the staff's Designation permissions.
const ALWAYS_VISIBLE_TITLES = new Set(['dashboard', 'profits']);

const normalize = (title) => (title || '').toLowerCase().trim();

// Hides sidebar items a staff member's Designation doesn't have "view"
// permission for, so the menu matches what the backend will actually let
// them open (super admins always see everything).
export function filterNavConfigByPermission(navConfig, { isSuperAdmin, permissions }) {
  if (isSuperAdmin || !Array.isArray(navConfig)) {
    return navConfig;
  }

  const viewableTitles = new Set(
    (permissions || [])
      .filter((permission) => permission?.view)
      .map((permission) => normalize(permission?.title))
  );

  const canView = (title) => ALWAYS_VISIBLE_TITLES.has(normalize(title)) || viewableTitles.has(normalize(title));

  return navConfig
    .map((section) => ({
      ...section,
      items: (section.items || []).filter((item) => canView(item.title)),
    }))
    .filter((section) => section.items.length > 0);
}
