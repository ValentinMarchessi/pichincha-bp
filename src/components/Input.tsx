import { InputHTMLAttributes } from "react";

interface InputProps {
  label: string;
  error?: string;
}

export default function Input({
  label,
  name,
  error,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="input-container">
      <label htmlFor={name}>
        {label}
        {rest.required && "*"}
      </label>
      <input id={name} name={name} {...rest} />
      {error && <p className="error">{error}</p>}
    </div>
  );
}
