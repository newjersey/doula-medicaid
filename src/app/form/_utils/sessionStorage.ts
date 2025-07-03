export const setKeyValue = (key: string, value: string): void => {
  window.sessionStorage.setItem(key, value);
};

export const getValue = (key: string): string | null => {
  return window.sessionStorage.getItem(key);
};

export const removeKey = (key: string): void => {
  window.sessionStorage.removeItem(key);
};
