const BASE_URL =
  "https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros";

export class AssetServices {
  private static base_url = BASE_URL;
  private static headers: Headers = new Headers({
    "Content-Type": "application/json",
    // TODO: Change authorId to 5356 when form is ready
    authorId: "1",
  });

  static async getAssets() {
    const response = await fetch(`${this.base_url}/bp/products`, {
      headers: this.headers,
    });
    const data = await response.json();
    return data;
  }
}
