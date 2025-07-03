export function setKeyValue(key: string, value: string): void {
  window.sessionStorage.setItem(key, value);
}

export function getValue(key: string): string | null {
  return window.sessionStorage.getItem(key);
}

export function removeKey(key: string): void {
  window.sessionStorage.removeItem(key);
}
