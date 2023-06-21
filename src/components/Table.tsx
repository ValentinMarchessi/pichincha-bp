interface Props {}

export default function Table<Item extends Record<string, string>>() {
  const headers = [
    "Logo",
    "Nombre del producto",
    "Descripción",
    "Fecha de liberación",
    "Fecha de reestructuración",
  ];

  return (
    <div id="table">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>
                <span>{header}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span>Logo</span>
            </td>
            <td>
              <span>Nombre del producto</span>
            </td>
            <td>
              <span>Descripción</span>
            </td>
            <td>
              <span>Fecha de liberación</span>
            </td>
            <td>
              <span>Fecha de reestructuración</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
