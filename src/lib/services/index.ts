import { getEnvironmentVar } from "@/lib/helpers";
import { ENVIRONMENT } from "@/lib/enums";

export class AssetServices {
  private static URL = getEnvironmentVar(ENVIRONMENT.API_URL);
  private static headers: Headers = new Headers({
    "Content-Type": "application/json",
    authorId: getEnvironmentVar(ENVIRONMENT.AUTHOR_ID),
  });

  static async getAssets(): Promise<Asset[]> {
    const response = await fetch(`${this.URL}/bp/products`, {
      method: "GET",
      headers: this.headers,
    });
    const data = await response.json();
    return data;
  }
}
