import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";
import { formatCurrency, formatDate } from "@/utils/formatters";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const productData = await productService.getById(parseInt(id));
      setProduct(productData);
      
      if (productData.categoryId) {
        const categoryData = await categoryService.getById(productData.categoryId);
        setCategory(categoryData);
      }
    } catch (err) {
      setError("Failed to load product details. Please try again.");
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await productService.delete(product.Id);
        toast.success("Product deleted successfully!");
        navigate("/inventory");
      } catch (error) {
        toast.error("Failed to delete product");
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/add-product?edit=${product.Id}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading showHeader={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadProduct} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message="Product not found" showRetry={false} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <button
          onClick={() => navigate("/inventory")}
          className="hover:text-primary-600 transition-colors"
        >
          Inventory
        </button>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <ApperIcon name="Package" className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center space-x-4">
              <Badge 
                variant={product.inStock ? "success" : "danger"}
                size="lg"
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
              {category && (
                <Badge variant="primary" size="lg">
                  <ApperIcon name={category.icon} className="w-3 h-3 mr-1" />
                  {category.name}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 lg:mt-0 flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={handleEdit}
          >
            <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
            Edit Product
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Info" className="w-5 h-5 mr-2 text-primary-600" />
              Product Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Product Name</label>
                <p className="text-base text-gray-900 mt-1">{product.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Barcode/SKU</label>
                <p className="text-base text-gray-900 mt-1 font-mono">{product.barcode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-base text-gray-900 mt-1">
                  {category ? category.name : "Uncategorized"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-base text-gray-900 mt-1">
                  {product.inStock ? "Available" : "Out of Stock"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-base text-gray-900 mt-1">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Product Image */}
          {product.imageUrl && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Image" className="w-5 h-5 mr-2 text-primary-600" />
                Product Image
              </h2>
              <div className="max-w-md mx-auto">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price & Stock Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="DollarSign" className="w-5 h-5 mr-2 text-primary-600" />
              Pricing & Stock
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Current Price</label>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Quantity in Stock</label>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {product.quantity} units
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Value</label>
                <p className="text-xl font-semibold text-green-600 mt-1">
                  {formatCurrency(product.price * product.quantity)}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Calendar" className="w-5 h-5 mr-2 text-primary-600" />
              Record Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Product ID</label>
                <p className="text-base text-gray-900 mt-1 font-mono">#{product.Id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-base text-gray-900 mt-1">
                  {formatDate(product.createdAt)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-base text-gray-900 mt-1">
                  {formatDate(product.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Zap" className="w-5 h-5 mr-2 text-primary-600" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigator.clipboard?.writeText(product.barcode)}
              >
                <ApperIcon name="Copy" className="w-4 h-4 mr-2" />
                Copy Barcode
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleEdit}
              >
                <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                Delete Product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;