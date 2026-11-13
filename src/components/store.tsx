"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Buyer, CartLine, Category, Locale, Product } from "@/lib/types";
import { linkLocale, localValue, localized } from "@/lib/i18n";
import {
  canPrice,
  priceCents,
  quantityError,
  orderMultiple,
} from "@/lib/pricing";
import {
  cartSnapshot,
  serverCartSnapshot,
  subscribeCart,
  writeCart,
  subscribeReady,
  clientReady,
  serverReady,
} from "@/lib/cart-store";
type Store = {
  locale: Locale;
  t: (en: string, tr: string) => string;
  val: (s: string) => string;
  title: (p: { title: string; titleTr: string }) => string;
  href: (s: string) => string;
  products: Product[];
  categories: Category[];
  user: Buyer | null;
  demo: boolean;
  cart: CartLine[];
  ready: boolean;
  add: (line: CartLine) => boolean;
  update: (variantId: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  drawer: boolean;
  setDrawer: (v: boolean) => void;
  toast: (s: string) => void;
  buyerDemo: () => Promise<void>;
  api: <T = Record<string, unknown>>(path: string, data: unknown) => Promise<T>;
  setCart: (lines: CartLine[]) => void;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({
  children,
  locale,
  products,
  categories,
  user,
  demo,
}: {
  children: ReactNode;
  locale: Locale;
  products: Product[];
  categories: Category[];
  user: Buyer | null;
  demo: boolean;
}) {
  const cart = useSyncExternalStore(
    subscribeCart,
    cartSnapshot,
    serverCartSnapshot,
  );
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const setCart = writeCart;
  const [drawer, setDrawer] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4500);
    return () => clearTimeout(timer);
  }, [message]);
  const t = (en: string, tr: string) => (locale === "tr" ? tr : en);
  const api = async <T,>(path: string, data: unknown): Promise<T> => {
    const res = await fetch(`/api/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-locale": locale },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok)
      throw new Error(
        result.error || t("Please try again.", "Lütfen tekrar deneyin."),
      );
    return result;
  };
  function add(line: CartLine) {
    const p = products.find((p) => p.id === line.productId);
    const v = p?.variants.find((v) => v.id === line.variantId);
    const existing = cart.find((l) => l.variantId === line.variantId);
    if (
      !p ||
      !v ||
      p.saleMode !== "STANDARD_ORDER" ||
      !canPrice(user?.role) ||
      quantityError(
        line.quantity + (existing?.quantity ?? 0),
        p.moq,
        orderMultiple(p.packMultiple, v.pack),
        v.demoCapacity,
      ) ||
      (!existing && cart.length >= 50)
    ) {
      setMessage(
        t(
          "Check the quantity and your account approval.",
          "Miktarı ve hesap onayınızı kontrol edin.",
        ),
      );
      return false;
    }
    setCart((prev) =>
      existing
        ? prev.map((l) =>
            l.variantId === line.variantId
              ? { ...l, quantity: l.quantity + line.quantity }
              : l,
          )
        : [...prev, line],
    );
    setDrawer(true);
    return true;
  }
  async function buyerDemo() {
    try {
      await api("auth/demo", {});
      router.refresh();
      setMessage(
        t(
          "Buyer demo is ready. Sample pricing is now visible.",
          "Müşteri demosu hazır. Örnek fiyatlar artık görünür.",
        ),
      );
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  return (
    <Context.Provider
      value={{
        locale,
        t,
        val: (s) => {
          const item =
            products.find((p) => p.title === s) ??
            categories.find((c) => c.title === s);
          return item ? localized(item, locale) : localValue(s, locale);
        },
        title: (p) => localized(p, locale),
        href: (s) => linkLocale(s, locale),
        products,
        categories,
        user,
        demo,
        cart,
        ready,
        add,
        update: (id, q) =>
          setCart((prev) =>
            prev.map((l) => (l.variantId === id ? { ...l, quantity: q } : l)),
          ),
        remove: (id) =>
          setCart((prev) => prev.filter((l) => l.variantId !== id)),
        clear: () => setCart([]),
        drawer,
        setDrawer,
        toast: setMessage,
        buyerDemo,
        api,
        setCart,
      }}
    >
      {children}
      {message && (
        <div className="toast" role="status">
          {message}
        </div>
      )}
    </Context.Provider>
  );
}
export function useStore() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("StoreProvider missing");
  return ctx;
}
export function useCartSummary() {
  const { cart, products } = useStore();
  const items = cart.map((line) => {
    const product = products.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    const price =
      product && variant && product.baseCents !== null
        ? priceCents(
            product.baseCents,
            variant.adjustmentCents ?? 0,
            line.quantity,
            product.tiers,
          )
        : null;
    const multiple =
      product && variant
        ? orderMultiple(product.packMultiple, variant.pack)
        : 50;
    const minimum = Math.ceil((product?.moq ?? 100) / multiple) * multiple;
    return { ...line, product, variant, price, multiple, minimum };
  });
  return {
    items,
    total: items.reduce((n, i) => n + (i.price?.totalCents ?? 0), 0),
    count: cart.reduce((n, i) => n + i.quantity, 0),
  };
}
