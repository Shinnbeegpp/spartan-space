export const ROLE_DASHBOARD_PATHS = {
  student: '/student/dashboard',
  landlord: '/landlord/dashboard',
  admin: '/admin',
};

export function getDashboardPath(role) {
  return ROLE_DASHBOARD_PATHS[role] ?? null;
}

export function getStoredToken() {
  return localStorage.getItem('token') || localStorage.getItem('student_token');
}

export function saveAuthSession(token, role) {
  localStorage.removeItem('token');
  localStorage.removeItem('student_token');

  const storageKey = role === 'student' ? 'student_token' : 'token';
  localStorage.setItem(storageKey, token);
}

export function clearAuthSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('student_token');
}
