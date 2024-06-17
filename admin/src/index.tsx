import "reflect-metadata";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import App from "./App";

const element = document.getElementById('root');
const root = createRoot(element!);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  );