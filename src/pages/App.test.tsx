import App from "@/pages/App";
import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssetServices as AssetServicesImport } from "@/lib/services";
import asset from "@tests/__mocks__/asset.json";
import { BrowserRouter } from "react-router-dom";
import { useNavigate as useNavigate_untyped } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("@/lib/helpers");
jest.mock("@/lib/services");

const useNavigate = useNavigate_untyped as jest.MockedFunction<
  typeof useNavigate_untyped
>;

const AssetServices = AssetServicesImport as jest.Mocked<
  typeof AssetServicesImport
>;

const assetFactory = (): Asset => ({
  ...asset,
  id: Math.floor(Math.random() * 100000).toFixed(0),
});
const items = Array.from({ length: 10 }, assetFactory);

describe("App", () => {
  const navigate = jest.fn();
  const renderUI = () => ({
    user: userEvent.setup(),
    ...render(<App />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    }),
  });

  afterEach(() => {
    AssetServices.getAll.mockClear();
    useNavigate.mockClear();
  });
  beforeEach(() => {
    useNavigate.mockImplementation(() => navigate);
    AssetServices.getAll.mockResolvedValue(items);
  });
  it("Should have a logo", async () => {
    const { findByAltText } = renderUI();
    expect(await findByAltText("logo-banco-pichincha")).toBeInTheDocument();
  });
  describe("Table", () => {
    const ITEMS_PER_PAGE = 5;

    describe("Controls", () => {
      describe("Searchbar", () => {
        it("Has a placeholder text", async () => {
          const { findByPlaceholderText } = renderUI();
          expect(await findByPlaceholderText("Search...")).toBeInTheDocument();
        });
        it("Filters items by name", async () => {
          const name = "Mocked name";
          AssetServices.getAll.mockClear();
          AssetServices.getAll.mockResolvedValue([
            ...items,
            {
              ...asset,
              name,
            },
          ]);

          const { findByPlaceholderText, findAllByText } = renderUI();
          const input = await findByPlaceholderText("Search...");
          const user = userEvent.setup();

          await act(async () => {
            await user.type(input, name);
          });

          expect(await findAllByText(name)).toHaveLength(1);
        });
        it("Displays a message when no items match the search criteria", async () => {
          const { findByPlaceholderText, findByText } = renderUI();
          const name = "Mocked name";
          AssetServices.getAll.mockClear();
          AssetServices.getAll.mockResolvedValue([
            ...items,
            {
              ...asset,
              name,
            },
          ]);

          const input = await findByPlaceholderText("Search...");
          const user = userEvent.setup();

          await act(async () => {
            await user.clear(input);
            await user.type(input, "non-existing name");
          });

          expect(await findByText("No hay resultados")).toBeInTheDocument();
        });
        it("Clears the search results and displays all items when the search input is empty", async () => {
          const { findByPlaceholderText, findAllByText } = renderUI();
          const input = await findByPlaceholderText("Search...");
          const user = userEvent.setup();

          await act(async () => {
            await user.type(input, items[0].name);
          });

          expect(await findAllByText(items[0].name)).toHaveLength(
            ITEMS_PER_PAGE
          );
        });
        it("Updates the search results as the user types in the search input", async () => {
          const names = ["Rockfest", "Runnemede", "Rockfall", "Rockfestfall"];
          AssetServices.getAll.mockClear();
          AssetServices.getAll.mockResolvedValue(
            names.map((name) => ({ ...assetFactory(), name }))
          );

          const { findByPlaceholderText, findAllByText } = renderUI();
          const input = await findByPlaceholderText("Search...");
          const user = userEvent.setup();

          await waitFor(() => {
            expect(AssetServices.getAll).toHaveBeenCalledTimes(1);
          });

          const options = { selector: "p", exact: false };

          await act(async () => {
            await user.clear(input);
            await user.type(input, "Rock");
          });
          expect(await findAllByText("Rock", options)).toHaveLength(3);

          await act(async () => {
            await user.clear(input);
            await user.type(input, "Run");
          });
          expect(await findAllByText("Runnemede", options)).toHaveLength(1);

          await act(async () => {
            await user.clear(input);
            await user.type(input, "Rockfest");
          });
          expect(await findAllByText("Rockfest", options)).toHaveLength(2);
        });
        it("Ignores case sensitivity when filtering items by name", async () => {
          const name = "Mocked name";
          AssetServices.getAll.mockClear();
          AssetServices.getAll.mockResolvedValue([
            ...items,
            {
              ...asset,
              name,
            },
          ]);

          const { findByPlaceholderText, findAllByText } = renderUI();
          const input = await findByPlaceholderText("Search...");
          const user = userEvent.setup();

          await act(async () => {
            await user.type(input, name.toLowerCase());
          });

          expect(await findAllByText(name)).toHaveLength(1);

          await act(async () => {
            await user.clear(input);
            await user.type(input, name.toUpperCase());
          });

          expect(await findAllByText(name)).toHaveLength(1);
        });
      });
      describe("Add asset", () => {
        it("Has a button to add assets", async () => {
          const { findByText } = renderUI();
          expect(await findByText("Agregar")).toBeInTheDocument();
        });
        it("Redirects to asset form", async () => {
          const { findByText } = renderUI();
          const user = userEvent.setup();
          const button = await findByText("Agregar");
          await act(async () => {
            expect(AssetServices.getAll).toHaveBeenCalledTimes(1);
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
        const { findByText } = renderUI();
        await expect(findByText(header)).resolves.toBeInTheDocument();
      });
    });
    describe("Items", () => {
      it(`Displays ${ITEMS_PER_PAGE} items per page`, async () => {
        const { queryAllByText } = renderUI();
        await waitFor(() => {
          expect(AssetServices.getAll).toHaveBeenCalledTimes(1);
        });
        // 10 items
        expect(queryAllByText(asset.name)).toHaveLength(ITEMS_PER_PAGE);
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
          const { findAllByText, findAllByAltText } = renderUI();

          await waitFor(() => {
            expect(AssetServices.getAll).toHaveBeenCalledTimes(1);
          });

          const value = asset[field];

          switch (field) {
            case "logo":
              // logo is displayed as an image
              expect(await findAllByAltText(`${asset.name}-logo`)).toHaveLength(
                ITEMS_PER_PAGE
              );
              break;
            case "date_release":
            case "date_revision":
              // date_release and date_revision are formatted using toLocaleDateString
              expect(
                await findAllByText(
                  new Date(value).toLocaleDateString("es", { timeZone: "UTC" }),
                  {
                    selector: "p",
                  }
                )
              ).toHaveLength(ITEMS_PER_PAGE);
              break;
            default:
              // the rest of the fields are displayed as text
              expect(
                await findAllByText(value, { selector: "p" })
              ).toHaveLength(ITEMS_PER_PAGE);
              break;
          }
        });
      });
      describe("Actions", () => {
        describe("Edit", () => {
          it("Has an edit button for each item", async () => {
            const { findAllByTestId } = renderUI();
            await waitFor(() => {
              expect(AssetServices.getAll).toHaveBeenCalledTimes(1);
            });
            expect(await findAllByTestId("menu-icon")).toHaveLength(
              ITEMS_PER_PAGE
            );
          });
          it("Redirects to asset form with all the asset data loaded into the navigation state", async () => {
            const { findAllByText /* getByLabelText */, user } = renderUI();
            const buttons = await findAllByText("Editar");
            expect(AssetServices.getAll).toHaveBeenCalledTimes(1);
            await act(async () => {
              await user.click(buttons[0]);
            });
            await waitFor(() =>
              expect(navigate).toHaveBeenCalledWith(
                `/assetForm/${items[0].id}`,
                { state: { asset: items[0] } }
              )
            );
          });
        });
        describe("Delete", () => {
          beforeAll(() => {
            AssetServices.delete.mockResolvedValue(true);
          });
          it("Has a delete button for each item", async () => {
            const { findAllByTestId } = renderUI();
            expect(AssetServices.getAll).toHaveBeenCalledTimes(1);
            expect(await findAllByTestId("delete-icon")).toHaveLength(
              ITEMS_PER_PAGE
            );
          });
          it("Deletes the asset", async () => {
            const { findAllByText } = renderUI();
            const user = userEvent.setup();
            const buttons = await findAllByText("Eliminar");
            await user.click(buttons[0]);
            await waitFor(() => {
              expect(AssetServices.delete).toHaveBeenCalledWith(items[0].id);
            });
          });
          it("Shows an alert if the deletion fails", async () => {
            AssetServices.delete.mockRejectedValueOnce(new Error("Mocked"));
            window.alert = jest.fn();
            const alertSpy = jest.spyOn(window, "alert");
            const { findAllByText } = renderUI();
            const user = userEvent.setup();
            const buttons = await findAllByText("Eliminar");
            await act(async () => {
              await user.click(buttons[0]);
            });
            await waitFor(() => {
              expect(AssetServices.delete).toHaveBeenCalledWith(items[0].id);
            });
            expect(alertSpy).toHaveBeenCalledWith("Mocked");
          });
        });
      });
    });
  });
});
