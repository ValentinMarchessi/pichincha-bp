import { faker } from "@faker-js/faker";
import asset from "./__mocks__/asset.json";

export const assetFactory = (length = 100): Asset[] =>
  Array.from({ length }, () => ({ ...asset, id: faker.string.uuid() }));
