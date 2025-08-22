import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import InventoryPage from "@/components/pages/InventoryPage";
import CategoriesPage from "@/components/pages/CategoriesPage";
import AddProductPage from "@/components/pages/AddProductPage";
import ReportsPage from "@/components/pages/ReportsPage";
import ProductDetailsPage from "@/components/pages/ProductDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<InventoryPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="add-product" element={<AddProductPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-50"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;