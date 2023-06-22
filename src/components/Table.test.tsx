import { render } from "@testing-library/react";
import Table from "./Table";

describe("Table", () => {
  const item = {
    id: "123",
    name: "test",
  };

  const mapper = jest.fn(({ id, name }: typeof item) => (
    <tr key={id}>
      <td>{id}</td>
      <td>{name}</td>
    </tr>
  ));

  afterEach(() => {
    mapper.mockClear();
  });

  it("Is defined", () => {
    const { baseElement } = render(
      <Table headers={["id", "name"]} items={[item]} mapper={mapper} />
    );

    expect(baseElement).toBeDefined();
  });
  it("Renders the headers", () => {
    const { getByText } = render(
      <Table headers={["id", "name"]} items={[item]} mapper={mapper} />
    );

    expect(getByText("id")).toBeInTheDocument();
    expect(getByText("name")).toBeInTheDocument();
  });

  it("Renders the items with mapper", () => {
    const { getByText } = render(
      <Table headers={["id", "name"]} items={[item]} mapper={mapper} />
    );
    expect(getByText(item.id)).toBeInTheDocument();
    expect(getByText(item.name)).toBeInTheDocument();
    expect(mapper).toBeCalledTimes(1);
  });
});
