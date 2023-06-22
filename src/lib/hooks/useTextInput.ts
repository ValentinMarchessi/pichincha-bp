import React from "react";

type Options = {
  defaultValue?: string;
  min?: number;
  max?: number;
  required?: boolean;
  label?: string;
};

export default function useTextInput(name: string, options?: Options) {
  const [value, setValue] = React.useState(options?.defaultValue ?? "");
  const [error, setError] = React.useState<string>("");
  const [touched, setTouched] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!touched) return;

    if (options?.min && value && value.length < options.min) {
      setError(`Mínimo de ${options.min} carácteres.`);
    } else if (options?.max && value && value.length > options.max) {
      setError(`Máximo de ${options.max} carácteres.`);
    } else if (options?.required && !value) {
      setError("Este campo es requerido.");
    } else {
      setError("");
    }

    return () => {
      setTouched(false);
    };
  }, [value, options, name, touched]);

  return {
    type: "text",
    name,
    value,
    error,
    required: options?.required,
    label: options?.label ?? name,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(e.target.value),
    onBlur: () => setTouched(true),
  };
}
