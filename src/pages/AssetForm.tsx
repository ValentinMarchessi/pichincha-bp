import Nav from "@/components/Nav";
import "./AssetForm.css";
import useInput from "@/lib/hooks/useInput";
import { AssetServices } from "@/lib/services";
import { useNavigate } from "react-router-dom";
import Input from "@/components/Input";
import { useEffect, useState } from "react";

export default function AssetForm() {
  const navigate = useNavigate();
  const inputs: Record<keyof Asset, ReturnType<typeof useInput>> = {
    id: useInput("id", {
      required: true,
      min: 3,
      max: 10,
      label: "ID",
    }),
    name: useInput("name", {
      required: true,
      min: 5,
      max: 100,
      label: "Nombre",
    }),
    description: useInput("description", {
      required: true,
      min: 10,
      max: 200,
      label: "Descripción",
    }),
    logo: useInput("logo", { required: true, label: "Logo" }),
    date_release: useInput("date_release", {
      type: "date",
      label: "Fecha Liberación",
      min: new Date().toISOString().split("T")[0],
      required: true,
    }),
    date_revision: useInput("date_revision", {
      type: "date",
      label: "Fecha Revisión",
      required: true,
      disabled: true,
    }),
  };
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (inputs.date_release.props.value) {
      const date = new Date(inputs.date_release.props.value as string);
      date.setFullYear(date.getFullYear() + 1);
      inputs.date_revision.setValue(date.toISOString().split("T")[0]);
    }
  }, [inputs.date_release.props.value, inputs.date_revision]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setSubmitting(true);
    e.preventDefault();
    const asset = Object.fromEntries(
      Object.values(inputs).map(({ props }) => [props.name, props.value])
    ) as Asset;
    await AssetServices.create(asset)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        if (err instanceof Error) setError(err.message);
        else setError("Ha ocurrido un error inesperado.");
      });
    setSubmitting(false);
  }

  const isSubmitDisabled = Object.values(inputs).some((input) => input.error);
  const reset = () => {
    Object.values(inputs).forEach((input) => input.reset());
  };

  return (
    <>
      <Nav />
      <div id="body">
        <h2>Formulario de Registro</h2>
        <form
          onSubmit={handleSubmit}
          id="asset-form"
          role="asset-form"
          test-id="asset-form"
        >
          {Object.values(inputs).map((input) => (
            <Input
              label={input.label}
              error={input.error}
              key={input.label}
              {...input.props}
            />
          ))}
          <div className="info">
            {submitting && <p>Enviando...</p>}
            {error && <p className="error">{error}</p>}
          </div>
          <div className="buttons">
            <button className="secondary" type="reset" onClick={reset}>
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
