import Nav from "@/components/Nav";
import "./AssetForm.css";
import { InputHTMLAttributes } from "react";
import useTextInput from "@/lib/hooks/useTextInput";
import useDateInput from "@/lib/hooks/useDateInput";
import { AssetServices } from "@/lib/services";
import { useNavigate } from "react-router-dom";

export default function AssetForm() {
  const navigate = useNavigate();
  const inputs = {
    id: useTextInput("id", {
      required: true,
      min: 3,
      max: 10,
      label: "ID",
    }),
    name: useTextInput("name", {
      required: true,
      min: 5,
      max: 100,
      label: "Nombre",
    }),
    description: useTextInput("description", {
      required: true,
      min: 10,
      max: 200,
      label: "Descripción",
    }),
    logo: useTextInput("logo", { required: true, label: "Logo" }),
    dateRelease: useDateInput("date_release", {
      label: "Fecha Liberación",
    }),
    dateRevision: useDateInput("date_revision", {
      label: "Fecha Revisión",
    }),
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const asset: Asset = {
      id: data.get("id") as string,
      name: data.get("name") as string,
      description: data.get("description") as string,
      logo: data.get("logo") as string,
      date_release: data.get("date_release") as string,
      date_revision: data.get("date_revision") as string,
    };
    await AssetServices.create(asset);
    navigate("/");
  }

  const isSubmitDisabled = Object.values(inputs).some((input) => input.error);

  return (
    <>
      <Nav />
      <div id="body">
        <h2>Formulario de Registro</h2>
        <form onSubmit={handleSubmit} id="asset-form">
          {Object.values(inputs).map((input) => (
            <Input key={input.name} {...input} />
          ))}
          <div className="buttons">
            <button className="secondary" type="reset">
              Reiniciar
            </button>
            <button type="submit" disabled={isSubmitDisabled}>
              Enviar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

interface InputProps {
  label: string;
  error?: string;
}

function Input({
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
      <input name={name} {...rest} />
      {error && <p className="error">{error}</p>}
    </div>
  );
}
