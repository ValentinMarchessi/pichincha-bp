import { InputHTMLAttributes } from "react";
import "./Input.css";
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
      <div className="input-info">{error && <p className="error">{error}</p>}</div>
    </div>
  );
}
