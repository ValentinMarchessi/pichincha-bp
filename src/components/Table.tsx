import { useState } from "react";
import "./Table.css";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

interface Props<I> {
  headers: string[];
  items: I[];
  mapper: (item: I) => JSX.Element;
  fallback?: JSX.Element;
}

const ITEMS_PER_PAGE = 5;

export default function Table<I>({
  headers,
  items,
  mapper,
  fallback,
}: Props<I>) {
  const [page, setPage] = useState(0);

  const pages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const next = () => setPage((page) => Math.min(page + 1, pages - 1));
  const prev = () => setPage((page) => Math.max(page - 1, 0));

  const itemsPage =
    items.length > 0
      ? items.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)
      : [];

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
        {itemsPage.length > 0
          ? itemsPage.map(mapper)
          : fallback ?? <DefaultFallback colSpan={headers.length} />}
      </tbody>
      {items.length > 0 && (
        <tfoot>
          <tr>
            <td>
              <p>{items.length} Resultados</p>
            </td>
            <td colSpan={5}>
              <div className="pagination-controls">
                <button onClick={prev} disabled={page === 0}>
                  <BiSolidLeftArrow />
                </button>
                <p>
                  {page + 1} de {pages}
                </p>
                <button onClick={next} disabled={page === pages - 1}>
                  <BiSolidRightArrow />
                </button>
              </div>
            </td>
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
