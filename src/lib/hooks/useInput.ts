import React, { useEffect, useState } from "react";

type Options = {
  type?: "text" | "number" | "email" | "password" | "date";
  defaultValue?: string;
  min?: string | number;
  max?: string | number;
  required?: boolean;
  disabled?: boolean;
  label?: string;
};

export default function useInput(
  name: string,
  options?: Options
): {
  props: React.InputHTMLAttributes<HTMLInputElement>;
  error: string;
  label: string;
  reset: () => void;
  setValue: React.Dispatch<React.SetStateAction<string>>;
} {
  const [value, setValue] = useState(options?.defaultValue ?? "");
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);
  const { type = "text", min, max } = options ?? {};

  useEffect(() => {
    if (!touched) return;

    switch (type) {
      case "text":
        if (typeof min === "number" && value.length < min) {
          setError(`Debe tener al menos ${min} carácteres`);
        } else if (typeof max === "number" && value.length > max) {
          setError(`Debe tener un máximo de ${max} carácteres`);
        } else {
          setError("");
        }
        break;
      default:
        setError("");
        break;
    }

    return () => {
      setTouched(false);
    };
  }, [value, type, name, touched, min, max]);

  return {
    setValue,
    reset: () => setValue(options?.defaultValue ?? ""),
    label: options?.label ?? name,
    error,
    props: {
      type: options?.type ?? "text",
      name,
      value,
      min: options?.min,
      max: options?.max,
      disabled: options?.disabled,
      required: options?.required,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(e.target.value),
      onBlur: () => setTouched(true),
    },
  };
}
