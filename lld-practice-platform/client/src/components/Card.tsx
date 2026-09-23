import { HTMLAttributes, ReactNode } from "react";

export function Card({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={`rounded-lg border border-ink-800/10 bg-white ${className}`} {...rest}>
      {children}
    </div>
  );
}
