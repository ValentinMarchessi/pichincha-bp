import App from "@/pages/App";
import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssetServices as AssetServicesImport } from "@/services";
import asset from "@tests/__mocks__/asset.json";
import { BrowserRouter } from "react-router-dom";

jest.mock("@/services");
const AssetServices = AssetServicesImport as jest.Mocked<
  typeof AssetServicesImport
>;

const assetFactory = (): Asset => ({
  ...asset,
  id: Math.floor(Math.random() * 100000).toFixed(0),
});
const items = Array.from({ length: 10 }, assetFactory);

describe("App", () => {
  const renderApp = () =>
    render(<App />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    });

  afterEach(() => {
    AssetServices.getAssets.mockClear();
  });
  beforeEach(() => {
    AssetServices.getAssets.mockResolvedValue(items);
  });
  it("Should have a logo", async () => {
    const { findByAltText } = renderApp();
    expect(await findByAltText("logo-banco-pichincha")).toBeInTheDocument();
  });
  describe("Table", () => {
    describe("Controls", () => {
      describe("Searchbar", () => {
        it("Has a placeholder text", async () => {
          const { findByPlaceholderText } = renderApp();
          expect(await findByPlaceholderText("Search...")).toBeInTheDocument();
        });
        it.todo("Filters items by name");
        it.todo("Displays a message when no items match the search criteria");
        it.todo(
          "Clears the search results and displays all items when the search input is empty"
        );
        it.todo(
          "Updates the search results as the user types in the search input"
        );
        it.todo("Ignores case sensitivity when filtering items by name");
      });
      describe("Add asset", () => {
        it("Has a button to add assets", async () => {
          const { findByText } = renderApp();
          expect(await findByText("Agregar")).toBeInTheDocument();
        });
        it("Redirects to asset form", async () => {
          const { findByText } = renderApp();
          const user = userEvent.setup();
          const button = await findByText("Agregar");
          await act(async () => {
            expect(AssetServices.getAssets).toHaveBeenCalledTimes(1);
            await user.click(button);
          });
          expect(window.location.pathname.endsWith("/assetForm")).toBeTruthy();
        });
      });
    });
    describe("Headers", () => {
      const headers = [
        "Logo",
        "Nombre del producto",
        "Descripción",
        "Fecha de liberación",
      ];
      it.each(headers)("Has %p header", async (header) => {
        const { findByText } = renderApp();
        await expect(findByText(header)).resolves.toBeInTheDocument();
      });
    });
    describe("Items", () => {
      it("Has 10 items", async () => {
        const { queryAllByText } = renderApp();
        await waitFor(() => {
          expect(AssetServices.getAssets).toHaveBeenCalledTimes(1);
        });
        // 10 items
        expect(queryAllByText(asset.name)).toHaveLength(10);
      });
      describe("Fields", () => {
        const visible_fields: (keyof typeof asset)[] = [
          "name",
          "logo",
          "description",
          "date_release",
          "date_revision",
        ];
        it.each(visible_fields)("Renders %p", async (field) => {
          const { findAllByText, findAllByAltText } = renderApp();

          await waitFor(() => {
            expect(AssetServices.getAssets).toHaveBeenCalledTimes(1);
          });

          const value = asset[field];

          switch (field) {
            case "logo":
              // logo is displayed as an image
              expect(await findAllByAltText(`${asset.name}-logo`)).toHaveLength(
                10
              );
              break;
            case "date_release":
            case "date_revision":
              // date_release and date_revision are formatted using toLocaleDateString
              expect(
                await findAllByText(new Date(value).toLocaleDateString(), {
                  selector: "p",
                })
              ).toHaveLength(10);
              break;
            default:
              // the rest of the fields are displayed as text
              expect(
                await findAllByText(value, { selector: "p" })
              ).toHaveLength(10);
              break;
          }
        });
      });
    });
  });
});
