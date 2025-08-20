const USERS_STORAGE_KEY = 'users';
const LOGGED_IN_USER_KEY = 'loggedInUser';

export const saveUsersToStorage = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const loadUsersFromStorage = () => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  return storedUsers ? JSON.parse(storedUsers) : null;
};

export const saveLoggedInUserToStorage = (user) => {
  localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
};

export const loadLoggedInUserFromStorage = () => {
  const loggedInUser = localStorage.getItem(LOGGED_IN_USER_KEY);
  return loggedInUser ? JSON.parse(loggedInUser) : null;
};

export const removeLoggedInUserFromStorage = () => {
  localStorage.removeItem(LOGGED_IN_USER_KEY);
};