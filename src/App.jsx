import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { testConnection } from "./shared/testConnection";
testConnection(); // Remove after testing

const CustomerApp = lazy(() => import("./customer/CustomerApp.jsx"));
const VendorApp   = lazy(() => import("./vendor/VendorApp.jsx"));

function Loading() {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",flexDirection:"column",gap:12,fontFamily:"sans-serif",background:"#0D0D0D"}}>
      <div style={{fontSize:36}}>🛒</div>
      <div style={{color:"#F97316",fontSize:18,fontWeight:700}}>BLinkeRs</div>
      <div style={{color:"#6B7280",fontSize:13}}>Loading...</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/"       element={<CustomerApp />} />
          <Route path="/vendor" element={<VendorApp />}   />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
