import { getEnvironmentVar } from "@/lib/helpers";
import { ENVIRONMENT } from "@/lib/enums";

export class AssetServices {
  private static URL = getEnvironmentVar(ENVIRONMENT.API_URL);
  private static headers: Headers = new Headers({
    "Content-Type": "application/json",
    authorId: getEnvironmentVar(ENVIRONMENT.AUTHOR_ID),
  });

  static async getAll(): Promise<Asset[]> {
    const response = await fetch(`${this.URL}/bp/products`, {
      headers: this.headers,
      method: "GET",
    });
    const data = await response.json();
    return data;
  }

  static async create(asset: Asset) {
    const response = await fetch(`${this.URL}/bp/products`, {
      body: JSON.stringify(asset),
      headers: this.headers,
      method: "POST",
    });
    const data = await response.json();
    return data;
  }

  static async update(asset: Asset) {
    const response = await fetch(`${this.URL}/bp/products`, {
      body: JSON.stringify(asset),
      headers: this.headers,
      method: "PUT",
    });
    if (response.status !== 200) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    return data;
  }

  static async delete(id: string) {
    const response = await fetch(
      `${this.URL}/bp/products?${new URLSearchParams({ id })}`,
      {
        headers: this.headers,
        method: "DELETE",
      }
    );
    if (response.status === 404) {
      throw new Error("Asset not found");
    }
    return response.status === 200;
  }

  static async verifyId(id: string): Promise<boolean> {
    const response = await fetch(
      `${this.URL}/bp/products/verification?${new URLSearchParams({ id })}`,
      {
        headers: this.headers,
        method: "GET",
      }
    );
    return response.json();
  }
}
