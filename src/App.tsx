// import { useState } from "react";
import "./App.css";
import Table from "./components/Table";

const asset: Asset = {
  id: "trj-crd",
  name: "Tarjetas de Credito",
  logo: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg",
  description: "Tarjeta de consumo bajo la modalidad de crédito",
  date_release: "2023-02-01",
  date_revision: "2024-02-01",
};

const items = Array.from({ length: 10 }, () => asset);

function App() {
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
          items={items}
          mapper={(asset) => (
            <tr className="asset" key={asset.id}>
              <td>
                <img className="logo" src={asset.logo} alt={asset.name} />
              </td>
              <td>
                <span>{asset.name}</span>
              </td>
              <td>
                <span>{asset.description}</span>
              </td>
              <td>
                <span>{asset.date_release}</span>
              </td>
              <td>
                <span>{asset.date_revision}</span>
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
