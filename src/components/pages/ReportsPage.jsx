import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";
import { formatCurrency } from "@/utils/formatters";

const ReportsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load report data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading showHeader={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadData} />
      </div>
    );
  }

  // Calculate metrics
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const averagePrice = totalProducts > 0 ? totalInventoryValue / products.reduce((sum, p) => sum + p.quantity, 0) : 0;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  // Low stock products (quantity < 10)
  const lowStockProducts = products.filter(p => p.quantity < 10 && p.inStock);

  // Category distribution
  const categoryStats = categories.map(category => {
    const categoryProducts = products.filter(p => p.categoryId === category.Id);
    const categoryValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    return {
      ...category,
      productCount: categoryProducts.length,
      totalValue: categoryValue
    };
  }).sort((a, b) => b.totalValue - a.totalValue);

  // Top products by value
  const topProducts = [...products]
    .map(p => ({ ...p, totalValue: p.price * p.quantity }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Reports</h1>
        <p className="text-gray-600 mt-2">
          Analytics and insights for your inventory management.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">{inStockProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInventoryValue)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Additional Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2 text-primary-600" />
            Inventory Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Average Product Price</span>
              <span className="font-semibold text-gray-900">{formatCurrency(averagePrice)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Quantity</span>
              <span className="font-semibold text-gray-900">{totalQuantity} units</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Active Categories</span>
              <span className="font-semibold text-gray-900">{categories.length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Stock Availability</span>
              <span className="font-semibold text-gray-900">
                {totalProducts > 0 ? Math.round((inStockProducts / totalProducts) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="PieChart" className="w-5 h-5 mr-2 text-primary-600" />
            Category Distribution
          </h2>
          <div className="space-y-3">
            {categoryStats.map((category) => (
              <div key={category.Id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <ApperIcon name={category.icon} className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {category.productCount} products
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(category.totalValue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="AlertTriangle" className="w-5 h-5 mr-2 text-yellow-600" />
            Low Stock Alert
          </h2>
          {lowStockProducts.length === 0 ? (
            <div className="text-center py-4">
              <ApperIcon name="CheckCircle" className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-gray-600">All products have sufficient stock</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.Id} className="flex items-center justify-between py-2 px-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">SKU: {product.barcode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-800">
                      {product.quantity} left
                    </p>
                    <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
                  </div>
                </div>
              ))}
              {lowStockProducts.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  +{lowStockProducts.length - 5} more products with low stock
                </p>
              )}
            </div>
          )}
        </div>

        {/* Top Products by Value */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Trophy" className="w-5 h-5 mr-2 text-primary-600" />
            Top Products by Value
          </h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.Id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} units</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(product.totalValue)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(product.price)}/unit
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;