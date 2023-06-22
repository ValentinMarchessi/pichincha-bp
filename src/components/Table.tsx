import "./Table.css";

interface Props<I> {
  headers: string[];
  items: I[];
  mapper: (item: I) => JSX.Element;
  fallback?: JSX.Element;
}

export default function Table<I>({
  headers,
  items,
  mapper,
  fallback,
}: Props<I>) {
  return (
    <table id="asset-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>
              <h2>{header}</h2>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.length > 0
          ? items.map(mapper)
          : fallback ?? <DefaultFallback colSpan={headers.length} />}
      </tbody>
      {items.length > 0 && (
        <tfoot>
          <tr>
            <td>{items.length} Resultados</td>
          </tr>
        </tfoot>
      )}
    </table>
  );
}

function DefaultFallback({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        style={{ textAlign: "center", borderBottom: "none" }}
      >
        No hay resultados
      </td>
    </tr>
  );
}
