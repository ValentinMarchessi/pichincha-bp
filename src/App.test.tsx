import App from "@/App.tsx";
import { render, waitFor } from "@testing-library/react";
import { AssetServices as AssetServicesImport } from "./services";
import asset from "@tests/__mocks__/asset.json";

jest.mock("./services");
const AssetServices = AssetServicesImport as jest.Mocked<
  typeof AssetServicesImport
>;

const assetFactory = (): Asset => ({
  ...asset,
  id: Math.floor(Math.random() * 100000).toFixed(0),
});
const items = Array.from({ length: 10 }, assetFactory);

describe("App", () => {
  afterEach(() => {
    AssetServices.getAssets.mockClear();
  });
  beforeEach(() => {
    AssetServices.getAssets.mockResolvedValue(items);
  });
  it("Should have a logo", async () => {
    const { findByAltText } = render(<App />);
    expect(await findByAltText("logo-banco-pichincha")).toBeInTheDocument();
  });
  describe("Table", () => {
    describe("Headers", () => {
      const headers = [
        "Logo",
        "Nombre del producto",
        "Descripción",
        "Fecha de liberación",
      ];
      it.each(headers)("Has %p header", async (header) => {
        const { findByText } = render(<App />);
        await expect(findByText(header)).resolves.toBeInTheDocument();
      });
    });
    describe("Items", () => {
      it("Has 10 items", async () => {
        const { queryAllByText } = render(<App />);
        await waitFor(() => {
          expect(AssetServices.getAssets).toHaveBeenCalledTimes(1);
        });
        // 10 items
        expect(queryAllByText(asset.name)).toHaveLength(10);
      });
      describe("Fields", () => {
        it.each(Object.entries(asset))("Has %p field", async (field, value) => {
          const { queryAllByText, findAllByText, findAllByAltText } = render(
            <App />
          );

          await waitFor(() => {
            expect(AssetServices.getAssets).toHaveBeenCalledTimes(1);
          });

          switch (field) {
            case "id":
              // id is not displayed
              expect(queryAllByText(value)).toHaveLength(0);
              break;
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
