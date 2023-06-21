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
              <span>{header}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{items.map(mapper)}</tbody>
    </table>
  );
}
