import Input from "@/components/Input";
import Nav from "@/components/Nav";
import useInput from "@/lib/hooks/useInput";
import { AssetServices } from "@/lib/services";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./AssetForm.css";
import useTimeoutState from "@/lib/hooks/useTimeoutState";

export default function AssetForm() {
  const location = useLocation();
  const params = useParams();
  const {
    asset: initial = {
      id: "",
      date_release: "",
      date_revision: "",
      description: "",
      logo: "",
      name: "",
    },
  } = (location?.state ?? {}) as { asset: Asset };
  const navigate = useNavigate();
  const inputs: Record<keyof Asset, ReturnType<typeof useInput>> = {
    id: useInput("id", {
      defaultValue: initial.id,
      disabled: !!params.id,
      label: "ID",
      max: 10,
      min: 3,
      required: true,
      validator: async (value) =>
        await AssetServices.verifyId(value).then((taken) =>
          !taken ? null : "El ID ya está en uso."
        ),
    }),
    name: useInput("name", {
      defaultValue: initial.name,
      label: "Nombre",
      max: 100,
      min: 5,
      required: true,
    }),
    description: useInput("description", {
      defaultValue: initial.description,
      label: "Descripción",
      max: 200,
      min: 10,
      required: true,
    }),
    logo: useInput("logo", {
      defaultValue: initial.logo,
      label: "Logo",
      required: true,
    }),
    date_release: useInput("date_release", {
      defaultValue: initial.date_release.split("T")[0],
      label: "Fecha Liberación",
      min: new Date().toISOString().split("T")[0],
      required: true,
      type: "date",
    }),
    date_revision: useInput("date_revision", {
      defaultValue: initial.date_revision.split("T")[0],
      disabled: true,
      label: "Fecha Revisión",
      required: true,
      type: "date",
    }),
  };
  const [error, setError] = useTimeoutState("", 5000);
  const [submitting, setSubmitting] = useState(false);

  const handle = (asset: Asset) =>
    params.id ? AssetServices.update(asset) : AssetServices.create(asset);

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
    await handle(asset)
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
            {!submitting && error && <p className="error">{error}</p>}
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
