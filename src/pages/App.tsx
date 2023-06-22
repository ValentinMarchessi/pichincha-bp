import { useEffect, useMemo, useState } from "react";
import Table from "@/components/Table";
import { AssetServices } from "@/lib/services";
import { Link } from "react-router-dom";
import "./App.css";
import Nav from "@/components/Nav";

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    AssetServices.getAll().then((assets) => setAssets(assets));
  }, []);

  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) =>
        asset.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      ),
    [assets, searchQuery]
  );

  return (
    <>
      <Nav />
      <div id="body">
        <div className="header">
          <input
            id="searchbar"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />
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
          items={filteredAssets}
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
