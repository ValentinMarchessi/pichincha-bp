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
  describe("getAll", () => {
    const ENDPOINT_PATH = "bp/products";
    it(`Returns an array of ${NUMBER_OF_ASSETS} assets`, async () => {
      const data = await AssetServices.getAll();
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
      await AssetServices.getAll();
      expect(fetch).toHaveBeenCalledWith(`${URL}/${ENDPOINT_PATH}`, config);
    });
  });

  describe("create", () => {
    const ENDPOINT_PATH = "bp/products";
    const asset = assetFactory(1)[0];
    it("Returns the created asset", async () => {
      spy.mockImplementationOnce(
        jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve(asset),
          })
        ) as jest.Mock
      );
      const data = await AssetServices.create(asset);
      expect(data).toEqual(asset);
    });
    it("Calls fetch with the correct URL and config", async () => {
      const URL = getEnvironmentVar(ENVIRONMENT.API_URL);
      const config: RequestInit = {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          authorId: getEnvironmentVar(ENVIRONMENT.AUTHOR_ID),
        }),
        body: JSON.stringify(asset),
      };
      await AssetServices.create(asset);
      expect(fetch).toHaveBeenCalledWith(`${URL}/${ENDPOINT_PATH}`, config);
    });
  });

  describe("update", () => {
    const ENDPOINT_PATH = "bp/products";
    const asset = assetFactory(1)[0];
    it("Returns the updated asset", async () => {
      spy.mockImplementationOnce(
        jest.fn(() =>
          Promise.resolve({
            json: () => Promise.resolve(asset),
          })
        ) as jest.Mock
      );
      const data = await AssetServices.update(asset);
      expect(data).toEqual(asset);
    });
    it("Calls fetch with the correct URL and config", async () => {
      const URL = getEnvironmentVar(ENVIRONMENT.API_URL);
      const config: RequestInit = {
        method: "PUT",
        headers: new Headers({
          "Content-Type": "application/json",
          authorId: getEnvironmentVar(ENVIRONMENT.AUTHOR_ID),
        }),
        body: JSON.stringify(asset),
      };
      await AssetServices.update(asset);
      expect(fetch).toHaveBeenCalledWith(`${URL}/${ENDPOINT_PATH}`, config);
    });
  });

  describe("delete", () => {
    const ENDPOINT_PATH = "bp/products";
    const asset = assetFactory(1)[0];
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("Returns true if the response status is 200", async () => {
      spy.mockImplementationOnce(
        jest.fn(() =>
          Promise.resolve({
            status: 200,
            json: () => Promise.resolve(asset),
          })
        ) as jest.Mock
      );
      expect(await AssetServices.delete(asset.id)).toEqual(true);
    });
    it("Calls fetch with the correct URL and config", async () => {
      const URL = getEnvironmentVar(ENVIRONMENT.API_URL);
      const config: RequestInit = {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "application/json",
          authorId: getEnvironmentVar(ENVIRONMENT.AUTHOR_ID),
        }),
      };
      await AssetServices.delete(asset.id);
      const params = new URLSearchParams({ id: asset.id });
      expect(fetch).toHaveBeenCalledWith(
        `${URL}/${ENDPOINT_PATH}?${params}`,
        config
      );
    });
  });

  describe("verifyId", () => {
    it("Returns true if the response body is true", async () => {
      spy.mockImplementationOnce(
        jest.fn(() =>
          Promise.resolve({
            status: 200,
            json: () => Promise.resolve(true),
          })
        ) as jest.Mock
      );
      expect(await AssetServices.verifyId("123")).toEqual(true);
    });
    it("Returns false if the response body is false", async () => {
      spy.mockImplementationOnce(
        jest.fn(() =>
          Promise.resolve({
            status: 200,
            json: () => Promise.resolve(false),
          })
        ) as jest.Mock
      );
      expect(await AssetServices.verifyId("123")).toEqual(false);
    });
  });
});
