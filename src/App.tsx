// import { useState } from "react";
import { useEffect, useState } from "react";
import "./App.css";
import Table from "./components/Table";
import { AssetServices } from "./services";

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    AssetServices.getAssets().then((items) => setAssets(items));
  }, []);

  return (
    <>
      <nav>
        <img id="logo" src="logo.png" alt="logo-banco-pichincha" />
      </nav>
      <div id="body">
        <Table<Asset>
          headers={[
            "Logo",
            "Nombre del producto",
            "Descripción",
            "Fecha de liberación",
            "Fecha de reestructuración",
            "",
          ]}
          items={assets}
          mapper={(asset) => (
            <tr className="asset" key={asset.id}>
              <td>
                <img
                  className="logo"
                  src={asset.logo}
                  alt={`${asset.name}-logo`}
                />
              </td>
              <td>
                <p>{asset.name}</p>
              </td>
              <td>
                <p>{asset.description}</p>
              </td>
              <td>
                <p>{new Date(asset.date_release).toLocaleDateString()}</p>
              </td>
              <td>
                <p>{new Date(asset.date_revision).toLocaleDateString()}</p>
              </td>
              <td>Actions</td>
            </tr>
          )}
        />
      </div>
    </>
  );
}

export default App;
