const TOKEN_KEY = "token";
const USER_KEY = "user";

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};
