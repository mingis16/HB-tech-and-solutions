"use client";

import { Field, describedBy, fieldClass } from "./Field";

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  valid?: boolean;
  required?: boolean;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  maxLength?: number;
  className?: string;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  valid,
  required,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  maxLength,
  className,
}: TextFieldProps) {
  return (
    <Field id={id} label={label} required={required} error={error} className={className}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={fieldClass({ error, valid })}
        {...describedBy(id, error)}
      />
    </Field>
  );
}
