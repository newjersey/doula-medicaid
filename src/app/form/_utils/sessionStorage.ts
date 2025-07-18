export const setKeyValue = (key: string, value: string): void => {
  window.sessionStorage.setItem(key, value);
};

export const getValue = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return window.sessionStorage.getItem(key);
  }
  return null;
};

export const removeKey = (key: string): void => {
  window.sessionStorage.removeItem(key);
};
