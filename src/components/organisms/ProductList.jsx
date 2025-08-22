import { useState, useEffect } from "react";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { productService } from "@/services/api/productService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductList = ({ searchTerm, selectedCategory, sortBy }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await productService.delete(product.Id);
        setProducts(products.filter(p => p.Id !== product.Id));
        toast.success("Product deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete product");
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEditProduct = (product) => {
    navigate(`/add-product?edit=${product.Id}`);
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.Id}`);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "stock":
          return b.quantity - a.quantity;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  if (loading) {
    return <Loading rows={6} className="mt-6" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadProducts}
        className="mt-6"
      />
    );
  }

  if (filteredProducts.length === 0) {
    if (searchTerm || selectedCategory) {
      return (
        <Empty
          title="No products found"
          description="Try adjusting your search or filter criteria."
          actionLabel="Clear Filters"
          onAction={() => window.location.reload()}
          icon="Search"
          className="mt-6"
        />
      );
    }
    
    return (
      <Empty
        title="No products yet"
        description="Get started by adding your first product to the inventory."
        actionLabel="Add Product"
        onAction={() => navigate("/add-product")}
        icon="Package"
        className="mt-6"
      />
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.Id}
          product={product}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onViewDetails={handleViewDetails}
        />
      ))}
    </div>
  );
};

export default ProductList;