/**
 * Button Component
 * Reusable, accessible button with primary/secondary variants.
 */
import { type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  children?: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-colors",
  secondary:
    "rounded-full border border-black px-6 py-3 text-sm font-semibold text-black hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 transition-colors",
};

export default function Button({
  label,
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantStyles[variant]} ${className}`.trim()}
      aria-label={label}
      {...rest}
    >
      {children || label}
    </button>
  );
}
