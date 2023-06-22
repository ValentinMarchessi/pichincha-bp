import React from "react";

type Options = {
  defaultValue?: string;
  min?: string;
  max?: string;
  required?: boolean;
  label?: string;
};

export default function useDateInput(
  name: string,
  options?: Options
): React.InputHTMLAttributes<HTMLInputElement> & {
  error: string;
  label: string;
} {
  const [value, setValue] = React.useState(options?.defaultValue ?? "");
  const [error, setError] = React.useState<string>("");
  const [touched, setTouched] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!touched) return;
    if (options?.required && !value) {
      setError("Este campo es requerido.");
    }

    return () => {
      setTouched(false);
    };
  }, [value, options, name, touched]);

  return {
    type: "date",
    name,
    min: options?.min,
    max: options?.max,
    value,
    error,
    required: options?.required,
    label: options?.label ?? name,
    onBlur: () => setTouched(true),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setTouched(true);
      setValue(e.target.value);
    },
  };
}
