import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Global CSS for basic styling

import { Provider } from "react-redux"; // Redux store provider
import { BrowserRouter } from "react-router-dom"; // React Router for navigation
import store from "./redux/store"; // Your Redux store

import { LocalizationProvider } from "@mui/x-date-pickers"; // Material-UI date picker localization
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // Day.js adapter for date pickers

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Failed to find the root element");

// Render the React application
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* Provides the Redux store to the entire app */}
    <Provider store={store}>
      {/* Enables client-side routing */}
      <BrowserRouter>
        {/* Provides date localization context for Material-UI date pickers */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App /> {/* The main application component */}
        </LocalizationProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
