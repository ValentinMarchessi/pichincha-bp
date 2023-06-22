import { assetFactory } from "@tests/utils";
import { AssetServices } from ".";
import asset from "@mocks/asset.json";
import { getEnvironmentVar } from "@/lib/helpers";
import { ENVIRONMENT } from "@/lib/enums";

jest.mock("@/lib/helpers");

describe("Asset Services", () => {
  const NUMBER_OF_ASSETS = 5;
  let spy: jest.SpyInstance;
  beforeAll(() => {
    spy = jest.spyOn(global, "fetch").mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(assetFactory(NUMBER_OF_ASSETS)),
        })
      ) as jest.Mock
    );
  });
  afterAll(() => {
    spy.mockRestore();
  });
  describe("getAssets", () => {
    const ENDPOINT_PATH = "bp/products";
    it(`Returns an array of ${NUMBER_OF_ASSETS} assets`, async () => {
      const data = await AssetServices.getAssets();
      expect(data).toHaveLength(NUMBER_OF_ASSETS);
      for (const key of Object.keys(asset)) {
        for (const asset of data) {
          expect(asset).toHaveProperty(key);
        }
      }
    });
    it("Calls fetch with the correct URL and config", async () => {
      const URL = getEnvironmentVar(ENVIRONMENT.API_URL);
      const config: RequestInit = {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          authorId: getEnvironmentVar(ENVIRONMENT.AUTHOR_ID),
        }),
      };
      await AssetServices.getAssets();
      expect(fetch).toHaveBeenCalledWith(`${URL}/${ENDPOINT_PATH}`, config);
    });
  });
});
