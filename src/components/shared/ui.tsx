"use client";

/**
 * @amber-capability tempo.sync
 * @amber-doc Data portability interface exposing JSON export, JSON import (with optional replace), and full data clear via src/lib/sync, surfaced to the user on the Settings page alongside a theme toggle.
 */

import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "ghost", className = "", children, ...rest }: ButtonProps) {
  const v =
    variant === "primary" ? "btn btn-primary"
    : variant === "danger" ? "btn btn-danger"
    : "btn btn-ghost";
  return (
    <button {...rest} className={`${v} ${className}`}>
      {children}
    </button>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...rest }, ref) {
    return <input ref={ref} className={`input ${className}`} {...rest} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = "", children, ...rest }, ref) {
    return (
      <select ref={ref} className={`select ${className}`} {...rest}>
        {children}
      </select>
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className = "", ...rest }, ref) {
    return <textarea ref={ref} className={`textarea ${className}`} {...rest} />;
  },
);

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "muted" | "rose" }) {
  const cls = tone === "muted" ? "badge badge-muted" : tone === "rose" ? "badge badge-rose" : "badge";
  return <span className={cls}>{children}</span>;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-[color:var(--muted)] hover:text-[color:var(--text)] text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="space-y-3">{children}</div>
        {footer ? <div className="mt-5 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="card p-10 text-center">
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[color:var(--muted)] max-w-md mx-auto mb-4">{description}</p>
      {action}
    </div>
  );
}
