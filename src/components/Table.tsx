import "./Table.css";

interface Props<I> {
  headers: string[];
  items: I[];
  mapper: (item: I) => JSX.Element;
}

export default function Table<I>({ headers, items, mapper }: Props<I>) {
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
      <tbody>{items.map(mapper)}</tbody>
      <tfoot>
        <tr>
          <td>{items.length} Resultados</td>
        </tr>
      </tfoot>
    </table>
  );
}
