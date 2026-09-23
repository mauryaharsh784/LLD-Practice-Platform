import { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function FieldLabel({ children, ...rest }: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-ink-800/80" {...rest}>
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-md border border-ink-800/15 bg-white px-3 py-2 text-sm text-ink-800 outline-none placeholder:text-ink-800/35 focus:border-blueprint-500 focus:ring-1 focus:ring-blueprint-500"
      {...props}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="w-full rounded-md border border-ink-800/15 bg-white px-3 py-2 text-sm text-ink-800 outline-none placeholder:text-ink-800/35 focus:border-blueprint-500 focus:ring-1 focus:ring-blueprint-500"
      {...props}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="w-full rounded-md border border-ink-800/15 bg-white px-3 py-2 text-sm text-ink-800 outline-none focus:border-blueprint-500 focus:ring-1 focus:ring-blueprint-500"
      {...props}
    />
  );
}
