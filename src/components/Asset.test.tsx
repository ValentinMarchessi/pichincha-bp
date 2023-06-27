import { render, fireEvent } from "@testing-library/react";
import Asset from "./Asset";

const asset = {
  id: "1",
  name: "Test Asset",
  description: "This is a test asset",
  date_release: "2021-01-01",
  date_revision: "2021-01-02",
  logo: "https://example.com/logo.png",
};
describe("Asset", () => {
  const wrapper: React.JSXElementConstructor<{
    children: React.ReactElement;
  }> = ({ children }) => (
    <table>
      <tbody>{children}</tbody>
    </table>
  );
  test("renders asset data correctly", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const { findByText, getByAltText } = render(
      <Asset {...asset} onEdit={onEdit} onDelete={onDelete} />,
      { wrapper }
    );

    const [releaseDate, revisionDate] = [
      asset.date_release,
      asset.date_revision,
    ].map((date) =>
      new Date(date).toLocaleDateString("es", { timeZone: "UTC" })
    );

    expect(getByAltText(`${asset.name}-logo`)).toBeInTheDocument();
    expect(await findByText(asset.name)).toBeInTheDocument();
    expect(await findByText(asset.description)).toBeInTheDocument();
    expect(await findByText(releaseDate)).toBeInTheDocument();
    expect(await findByText(revisionDate)).toBeInTheDocument();
  });

  test("calls onEdit and onDelete when buttons are clicked", () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const { getByText } = render(
      <Asset {...asset} onEdit={onEdit} onDelete={onDelete} />,
      { wrapper }
    );

    fireEvent.click(getByText("Eliminar"));
    expect(onDelete).toHaveBeenCalledWith(asset.id);

    fireEvent.click(getByText("Editar"));
    expect(onEdit).toHaveBeenCalledWith(asset.id);
  });
});
