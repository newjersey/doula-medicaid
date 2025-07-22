export const setKeyValue = (key: string, value: string): void => {
  window.sessionStorage.setItem(key, value);
};

export const getValue = (key: string): string | null => {
  if (typeof window !== "undefined") {
    if (key === "npiNumber") {
      console.log(window.sessionStorage.getItem(key));
    }
    return window.sessionStorage.getItem(key);
  }
  if (key === "npiNumber") {
    console.log("got null");
  }

  return null;
};

export const removeKey = (key: string): void => {
  window.sessionStorage.removeItem(key);
};
