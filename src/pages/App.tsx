import { useEffect, useMemo, useState } from "react";
import Table from "@/components/Table";
import { AssetServices } from "@/lib/services";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import Nav from "@/components/Nav";
import Asset from "@/components/Asset";

function App() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AssetServices.getAll()
      .then((assets) => setAssets(assets))
      .then(() => setLoading(false));
  }, []);

  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) =>
        asset.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      ),
    [assets, searchQuery]
  );

  const assetHandlers = {
    onDelete: (id: string) => {
      AssetServices.delete(id)
        .then(() => setAssets((a) => a.filter((asset) => asset.id !== id)))
        .catch((e) => alert(e.message));
    },
    onEdit: (id: string) => {
      navigate(`/assetForm/${id}`, {
        state: { asset: assets.find((asset) => asset.id === id) },
      });
    },
  };

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
        {loading ? (
          <p>Cargando...</p>
        ) : (
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
              <Asset {...asset} key={asset.id} {...assetHandlers} />
            )}
          />
        )}
      </div>
    </>
  );
}

export default App;
