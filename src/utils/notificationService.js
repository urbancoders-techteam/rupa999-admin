export const STORAGE_KEY = 'app_notifications_v1';

export function getNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

export function saveNotifications(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    // ignore
  }
}

export function addNotification(item) {
  const list = getNotifications();
  const id = Date.now().toString();
  const newItem = { id, ...item, createdAt: new Date().toISOString() };
  list.unshift(newItem);
  saveNotifications(list);
  return newItem;
}

export function updateNotification(id, updates) {
  const list = getNotifications();
  const idx = list.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  saveNotifications(list);
  return list[idx];
}

export function removeNotification(id) {
  const list = getNotifications();
  const next = list.filter((i) => i.id !== id);
  saveNotifications(next);
  return next;
}
