import { render } from "@testing-library/react";
import Table from "./Table";
import userEvent from "@testing-library/user-event";

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

  describe("Pagination", () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      id: i.toString(),
      name: `test${i}`,
    }));

    it("Renders the items with mapper", () => {
      const { getByText } = render(
        <Table headers={["id", "name"]} items={items} mapper={mapper} />
      );
      expect(getByText(items[0].id)).toBeInTheDocument();
      expect(getByText(items[0].name)).toBeInTheDocument();
      expect(mapper).toBeCalledTimes(5);
    });

    it("Renders the pagination controls", async () => {
      const { getByText, getByTestId } = render(
        <Table headers={["id", "name"]} items={items} mapper={mapper} />
      );
      expect(getByText("1 de 2")).toBeInTheDocument();
      expect(getByTestId("prev")).toBeInTheDocument();
      expect(getByTestId("next")).toBeInTheDocument();
    });

    it("Renders the next page", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId } = render(
        <Table headers={["id", "name"]} items={items} mapper={mapper} />
      );
      expect(getByText("1 de 2")).toBeInTheDocument();
      await user.click(getByTestId("next"));
      expect(getByText(items[5].id)).toBeInTheDocument();
      expect(getByText(items[5].name)).toBeInTheDocument();
      expect(mapper).toBeCalledTimes(10);
    });

    it("Renders the previous page", async () => {
      const user = userEvent.setup();
      const { getByText, getByTestId } = render(
        <Table headers={["id", "name"]} items={items} mapper={mapper} />
      );
      expect(getByText("1 de 2")).toBeInTheDocument();
      await user.click(getByTestId("next"));
      expect(getByText("2 de 2")).toBeInTheDocument();
      await user.click(getByTestId("prev"));
      expect(getByText(items[0].id)).toBeInTheDocument();
      expect(getByText(items[0].name)).toBeInTheDocument();
    });
  });
});
