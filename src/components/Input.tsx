import { InputHTMLAttributes } from "react";
import "./Input.css";
interface InputProps {
  label: string;
  error?: string;
  validating?: boolean;
}

export default function Input({
  label,
  name,
  error,
  validating,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="input-container">
      <label htmlFor={name}>
        {label}
        {rest.required && "*"}
      </label>
      <input id={name} name={name} {...rest} />
      <div className="input-info">
        {validating && <p>Validando...</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
