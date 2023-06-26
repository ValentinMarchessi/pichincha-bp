import Menu from "./Menu";
import "./Asset.css";
import { GrMenu } from "react-icons/gr";
import { FaPen } from "react-icons/fa";
import { ImBin } from "react-icons/im";

type Props = Asset & {
  processing?: boolean;
  onEdit: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
};

export default function Asset({
  onEdit,
  onDelete,
  id,
  processing,
  ...asset
}: Props) {
  if (processing) {
    return (
      <tr className="asset processing" key={id}>
        <td colSpan={6}>
          <span className="spinner" />
        </td>
      </tr>
    );
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es", { timeZone: "UTC" });

  return (
    <tr className={`asset ${processing ? "processing" : ""}`} key={id}>
      <td>
        <img className="logo" src={asset.logo} alt={`${asset.name}-logo`} />
      </td>
      <td>
        <p>{asset.name}</p>
      </td>
      <td>
        <p>{asset.description}</p>
      </td>
      <td>
        <p>{formatDate(asset.date_release)}</p>
      </td>
      <td>
        <p>{formatDate(asset.date_revision)}</p>
      </td>
      <td>
        <Menu head={<GrMenu data-testid="menu-icon" size={20} />}>
          <div className="controls">
            <button className="secondary" onClick={() => onEdit(id)}>
              <FaPen />
              Editar
            </button>
            <button className="secondary delete" onClick={() => onDelete(id)}>
              <ImBin data-testid="delete-icon" />
              Eliminar
            </button>
          </div>
        </Menu>
      </td>
    </tr>
  );
}
