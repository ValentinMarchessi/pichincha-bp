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
      method: "GET",
      headers: this.headers,
    });
    const data = await response.json();
    return data;
  }

  static async create(asset: Asset) {
    const response = await fetch(`${this.URL}/bp/products`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(asset),
    });
    const data = await response.json();
    return data;
  }

  static async update(asset: Asset) {
    const response = await fetch(`${this.URL}/bp/products`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(asset),
    });
    const data = await response.json();
    return data;
  }

  static async delete(id: string) {
    const response = await fetch(
      `${this.URL}/bp/products?${new URLSearchParams({ id })}`,
      {
        method: "DELETE",
        headers: this.headers,
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
        method: "GET",
        headers: this.headers,
      }
    );
    return response.json();
  }
}
