"use client";
import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useStore } from "./store";
export function A({
  href,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const store = useStore();
  return (
    <Link href={store.href(href)} {...props}>
      {children}
    </Link>
  );
}
export function Photo({
  src,
  alt,
  priority = false,
  className = "",
  sizes = "(max-width: 640px) 90vw, 40vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      fill
      src={src}
      alt={alt}
      preload={priority}
      sizes={sizes}
      className={className}
    />
  );
}
export function Arrow() {
  return <ArrowUpRight size={18} strokeWidth={1.6} />;
}
export function Modal({
  open,
  onOpenChange,
  title,
  children,
  drawer = false,
  className = "",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  drawer?: boolean;
  className?: string;
}) {
  const { t } = useStore();
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          aria-describedby={undefined}
          className={`${drawer ? "drawer" : "modal"} ${className}`}
        >
          <div className="dialog-heading">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label={t("Close", "Kapat")}>
              <X size={22} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function DemoNote({ compact = false }: { compact?: boolean }) {
  const { t } = useStore();
  return (
    <p className={`demo-note ${compact ? "compact" : ""}`}>
      <span>DEMO</span>
      {t(
        "Sample configurations and USD estimates. Prices, availability, tax and freight require confirmation. No payment is collected.",
        "Örnek yapılandırmalar ve USD tahminleri. Fiyat, stok, vergi ve taşıma teyit gerektirir. Ödeme alınmaz.",
      )}
    </p>
  );
}
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  const { t } = useStore();
  return (
    <nav className="breadcrumb" aria-label={t("Breadcrumb", "Sayfa yolu")}>
      <A href="/">{t("Home", "Ana Sayfa")}</A>
      {items.map((i, n) => (
        <span key={n}>
          {" "}
          / {i.href ? <A href={i.href}>{i.label}</A> : i.label}
        </span>
      ))}
    </nav>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {description && <p className="lead">{description}</p>}
    </div>
  );
}
