import type { CartLine } from "./types";
const empty: CartLine[] = [];
let snapshot = empty;
let initialized = false;
const listeners = new Set<() => void>();
function read() {
  try {
    const data = JSON.parse(localStorage.getItem("sunka-cart-v1") ?? "[]");
    return Array.isArray(data)
      ? data
          .filter(
            (l) =>
              l &&
              typeof l.productId === "string" &&
              typeof l.variantId === "string" &&
              Number.isSafeInteger(l.quantity) &&
              l.quantity > 0,
          )
          .slice(0, 50)
      : [];
  } catch {
    return [];
  }
}
export function cartSnapshot() {
  if (!initialized) {
    snapshot = read();
    initialized = true;
  }
  return snapshot;
}
export const serverCartSnapshot = () => empty;
export function subscribeCart(listener: () => void) {
  listeners.add(listener);
  const sync = () => {
    snapshot = read();
    listener();
  };
  window.addEventListener("storage", sync);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", sync);
  };
}
export function writeCart(
  next: CartLine[] | ((previous: CartLine[]) => CartLine[]),
) {
  snapshot = typeof next === "function" ? next(cartSnapshot()) : next;
  initialized = true;
  try {
    localStorage.setItem("sunka-cart-v1", JSON.stringify(snapshot));
  } catch {
    /* In-memory cart remains usable if browser storage is unavailable. */
  }
  listeners.forEach((listener) => listener());
}
export const subscribeReady = () => () => {};
export const clientReady = () => true;
export const serverReady = () => false;
