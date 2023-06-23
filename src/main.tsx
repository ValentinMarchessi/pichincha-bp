import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import AssetForm from "./pages/AssetForm.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        element: <App />,
        index: true,
      },
      {
        element: <AssetForm />,
        path: "assetForm",
        children: [
          {
            element: <AssetForm />,
            path: ":id",
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
