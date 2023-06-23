import {
  RenderResult,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react";
import AssetForm from "./AssetForm";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import asset from "@mocks/asset.json";
import { AssetServices as AssetServices_untyped } from "@/lib/services";

const AssetServices = AssetServices_untyped as jest.Mocked<
  typeof AssetServices_untyped
>;

jest.mock("@/lib/helpers");
jest.mock("@/lib/services");

describe("AssetForm", () => {
  const setup = () => ({
    user: userEvent.setup(),
    ...render(<AssetForm />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    }),
  });
  let dateSpy: jest.SpyInstance;

  beforeAll(() => {
    dateSpy = jest.spyOn(Date, "now").mockImplementation(() => 0);
  });
  afterAll(() => {
    dateSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Displays 'Formulario de Registro' at the top", async () => {
    const { findByText } = setup();
    const title = await findByText("Formulario de Registro");
    expect(title).toBeInTheDocument();
  });
  describe("Inputs", () => {
    const inputs = [
      "ID",
      "Nombre",
      "Descripción",
      "Logo",
      "Fecha Liberación",
      "Fecha Revisión",
    ];
    describe.each(inputs)("'%s' input", (label) => {
      it("Has a label", async () => {
        const { findByLabelText } = setup();
        const input = await findByLabelText(label, { exact: false });
        expect(input).toBeInTheDocument();
      });
      it("Has a default value", async () => {
        const { findByLabelText } = setup();
        const input = await findByLabelText(label, { exact: false });
        expect(input).toHaveValue("");
      });
    });
    describe("Validation", () => {
      describe("ID", () => {
        it("Is required", () => {
          const { getByLabelText } = setup();
          const input = getByLabelText("ID", { exact: false });
          expect(input).toBeRequired();
        });
        it("Requires a minimum of 3 characters", async () => {
          const { findByLabelText } = setup();
          const input = await findByLabelText("ID", { exact: false });
          expect(input).toHaveAttribute("min", "3");
        });
        it("Requires a maximum of 10 characters", () => {
          const { getByLabelText } = setup();
          const input = getByLabelText("ID", { exact: false });
          expect(input).toHaveAttribute("max", "10");
        });
        it.todo("Validates that the ID is unique with the AssetsService");
      });
      describe("Name", () => {
        it("Is required", async () => {
          const { findByLabelText } = setup();
          const input = await findByLabelText("Nombre", { exact: false });
          expect(input).toBeRequired();
        });
        it("Requires a minimum of 5 characters", async () => {
          const { user, findByLabelText, findByText } = setup();
          const input = await findByLabelText("Nombre", { exact: false });
          expect(input).toHaveAttribute("min", "5");
          await user.type(input, "a");
          expect(input).toHaveValue("a");
          await user.click(await findByText("Enviar"));
          expect(
            await findByText("Debe tener al menos 5 carácteres")
          ).toBeInTheDocument();
        });
        it("Requires a maximum of 100 characters", async () => {
          const { user, findByLabelText, findByText } = setup();
          const input = await findByLabelText("Nombre", { exact: false });
          expect(input).toHaveAttribute("max", "100");
          await user.type(input, "a".repeat(200));
          expect(input).toHaveValue("a".repeat(200));
          await user.click(await findByText("Enviar"));
          expect(
            await findByText("Debe tener un máximo de 100 carácteres")
          ).toBeInTheDocument();
        });
      });
      describe("Description", () => {
        it("Is required", () => {
          const { getByLabelText } = setup();
          const input = getByLabelText("Descripción", { exact: false });
          expect(input).toBeRequired();
        });
        it("Requires a minimum of 10 characters", () => {
          const { getByLabelText } = setup();
          const input = getByLabelText("Descripción", { exact: false });
          expect(input).toHaveAttribute("min", "10");
        });
        it("Requires a maximum of 200 characters", () => {
          const { getByLabelText } = setup();
          const input = getByLabelText("Descripción", { exact: false });
          expect(input).toHaveAttribute("max", "200");
        });
      });
      describe("Logo", () => {
        it("Is required", () => {
          const { getByLabelText } = setup();
          const input = getByLabelText("Logo", { exact: false });
          expect(input).toBeRequired();
        });
      });
      describe("Date Release", () => {
        it("Is required", () => {
          const { getByLabelText } = setup();
          const input = getByLabelText("Fecha Liberación", { exact: false });
          expect(input).toBeRequired();
        });
        it("Must be equal or greater than today", () => {
          const { getByLabelText } = setup();
          const min = new Date().toISOString().split("T")[0];
          const input = getByLabelText("Fecha Liberación", { exact: false });
          expect(input).toHaveAttribute("min", min);
        });
      });
      describe("Date Revision", () => {
        it("Is required", () => {
          const { getByLabelText } = setup();
          const input = getByLabelText("Fecha Revisión", { exact: false });
          expect(input).toBeRequired();
        });
        it("Is disabled", () => {
          const { getByLabelText } = setup();
          const input = getByLabelText("Fecha Revisión", { exact: false });
          expect(input).toBeDisabled();
        });
        it("Must be always equal to a year after release date", async () => {
          // Change the Release Date to a random date and check that the Revision Date is always equal to a year after
          const { findByLabelText } = setup();
          const releaseDate = await findByLabelText("Fecha Liberación", {
            exact: false,
          });
          const revisionDate = await findByLabelText("Fecha Revisión", {
            exact: false,
          });
          const releaseDateValue = "2021-01-01";
          await userEvent.type(releaseDate, releaseDateValue);
          expect(releaseDate).toHaveValue(releaseDateValue);
          const revisionDateValue = "2022-01-01";
          expect(revisionDate).toHaveValue(revisionDateValue);
        });
      });
    });
  });
  describe("Buttons", () => {
    const fillForm = async (ui: RenderResult) => {
      const form = await ui.findByRole("asset-form");
      const user = userEvent.setup();
      const labels: Record<keyof Asset, string> = {
        id: "ID",
        name: "Nombre",
        description: "Descripción",
        logo: "Logo",
        date_release: "Fecha Liberación",
        date_revision: "Fecha Revisión",
      };
      const inputs: HTMLElement[] = [];
      for (const [field, label] of Object.entries(labels)) {
        const input = await ui.findByLabelText(label, { exact: false });
        const value = asset[field as keyof Asset];
        await user.type(input, value);
        expect(input).toHaveValue(value);
        inputs.push(input);
      }
      expect(form).toHaveFormValues(asset);
      return inputs;
    };

    afterEach(() => {
      jest.clearAllMocks();
    });
    it("Has a 'Reiniciar' button that resets the form", async () => {
      const { user, ...ui } = setup();
      const inputs: HTMLElement[] = await fillForm(ui);
      await user.click(await ui.findByText("Reiniciar"));
      for (const input of inputs) {
        expect(input).toHaveValue("");
      }
    });
    it("Has a 'Enviar' button that submits the form and redirects if the asset was created succesfully", async () => {
      AssetServices.create.mockImplementation(
        jest.fn(() => new Promise((res) => setTimeout(res, 300)))
      );
      const { user, ...ui } = setup();
      await fillForm(ui);
      await user.click(await ui.findByText("Enviar"));

      // Silly workarround to fix tests since clicking the button doesn't guarantee for the onSubmit handler to be called
      fireEvent.submit(await ui.findByRole("asset-form"));

      await waitFor(async () =>
        expect(
          await ui.findByText("Enviando...", { selector: "p" })
        ).toBeInTheDocument()
      );

      expect(AssetServices.create).toHaveBeenCalledWith(asset);
      expect(window.location.pathname).toBe("/");
    });
    it("Displays the error message if the asset creation failed", async () => {
      const errorMessage = "Error";
      AssetServices.create.mockImplementation(
        jest.fn(
          () =>
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error(errorMessage)), 300)
            )
        )
      );
      const { user, ...ui } = setup();
      await fillForm(ui);
      await user.click(await ui.findByText("Enviar"));

      // Silly workarround to fix tests since clicking the button doesn't guarantee for the onSubmit handler to be called
      fireEvent.submit(await ui.findByRole("asset-form"));

      await waitFor(async () =>
        expect(
          await ui.findByText("Enviando...", { selector: "p" })
        ).toBeInTheDocument()
      );
      expect(await ui.findByText(errorMessage)).toBeInTheDocument();
    });
    it("Displays a default error message if the asset creation failed and the error message is empty", async () => {
      AssetServices.create.mockImplementation(
        jest.fn(() => new Promise((_, reject) => setTimeout(reject, 300)))
      );
      const { user, ...ui } = setup();
      await fillForm(ui);
      await user.click(await ui.findByText("Enviar"));

      // Silly workarround to fix tests since clicking the button doesn't guarantee for the onSubmit handler to be called
      fireEvent.submit(await ui.findByRole("asset-form"));

      await waitFor(async () =>
        expect(
          await ui.findByText("Enviando...", { selector: "p" })
        ).toBeInTheDocument()
      );
      expect(
        await ui.findByText("Ha ocurrido un error inesperado", {
          exact: false,
          selector: "p",
        })
      ).toBeInTheDocument();
    });
  });
});
