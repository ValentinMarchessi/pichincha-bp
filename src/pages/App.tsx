import { useEffect, useState } from "react";
import Table from "@/components/Table";
import { AssetServices } from "@/services";
import { Link } from "react-router-dom";
import "./App.css";

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
        <div className="header">
          <input id="searchbar" type="text" placeholder="Search..." />
          <Link id="assetForm" to="/assetForm">
            Agregar
          </Link>
        </div>
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
