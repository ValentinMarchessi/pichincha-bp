import Menu from "./Menu";
import "./Asset.css";
import { GrMenu } from "react-icons/gr";
import { FaPen } from "react-icons/fa";
import { ImBin } from "react-icons/im";

type Props = Asset & {
  onEdit: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
};

export default function Asset({ onEdit, onDelete, id, ...asset }: Props) {
  return (
    <tr className="asset" key={id}>
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
        <p>{new Date(asset.date_release).toLocaleDateString()}</p>
      </td>
      <td>
        <p>{new Date(asset.date_revision).toLocaleDateString()}</p>
      </td>
      <td>
        <Menu head={<GrMenu size={20} />}>
          <div className="controls">
            <button className="secondary" onClick={() => onEdit(id)}>
              <FaPen />
              Editar
            </button>
            <button className="secondary delete" onClick={() => onDelete(id)}>
              <ImBin />
              Eliminar
            </button>
          </div>
        </Menu>
      </td>
    </tr>
  );
}
