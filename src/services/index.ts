export class AssetServices {
  private static URL = import.meta.env.VITE_API_URL;
  private static headers: Headers = new Headers({
    "Content-Type": "application/json",
    // TODO: Change authorId to 5356 when form is ready
    authorId: "1",
  });

  static async getAssets() {
    const response = await fetch(`${this.URL}/bp/products`, {
      headers: this.headers,
    });
    const data = await response.json();
    return data;
  }
}
