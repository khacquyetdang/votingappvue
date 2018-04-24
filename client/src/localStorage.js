export const TOKEN_KEY = '_token';

export const loadTokenStorage = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    return token;
  } catch (err) {
    return null;
  }
};

export const saveTokenStorage = token => {
  token
    ? localStorage.setItem(TOKEN_KEY, token)
    : localStorage.removeItem(TOKEN_KEY);
};
