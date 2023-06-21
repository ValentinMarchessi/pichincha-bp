import { render } from "@testing-library/react";
import Table from "./Table";

describe("Table", () => {
  const item = {
    id: "123",
    name: "test",
  };

  const mapper = jest.fn(({ id, name }: typeof item) => (
    <tr key={id}>{name}</tr>
  ));

  it("Is defined", () => {
    const { baseElement } = render(
      <Table headers={["id", "name"]} items={[item]} mapper={mapper} />
    );

    expect(baseElement).toBeDefined();
  });
});
