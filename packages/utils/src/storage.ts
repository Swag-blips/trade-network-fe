export type StorageArea = "local" | "session";

function area(name: StorageArea): Storage | null {
  try {
    return name === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function createStorage(name: StorageArea) {
  return {
    get(key: string): string | null {
      try {
        return area(name)?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },

    set(key: string, value: string) {
      try {
        area(name)?.setItem(key, value);
      } catch {
        // Nothing stored here is worth failing a flow over.
      }
    },

    remove(key: string) {
      try {
        area(name)?.removeItem(key);
      } catch {
        // As above.
      }
    },
  };
}

export const storage = {
  local: createStorage("local"),
  session: createStorage("session"),
};
