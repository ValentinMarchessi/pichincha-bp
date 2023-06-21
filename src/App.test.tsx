import App from "@/App.tsx";
import { render } from "@testing-library/react";

describe("App", () => {
  it("Should have a header text that says 'Banco Pichincha'", () => {
    const { getByText } = render(<App />);

    expect(getByText("Banco Pichincha")).toBeInTheDocument();
  });
});
