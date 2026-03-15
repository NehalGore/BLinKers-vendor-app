// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerApp  from "./customer/ListingScreen";
import VendorApp    from "./vendor/OrderScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<CustomerApp />} />
        <Route path="/vendor" element={<VendorApp />}   />
      </Routes>
    </BrowserRouter>
  );
}h
