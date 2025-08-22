import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import ProductList from "@/components/organisms/ProductList";
import { useNavigate } from "react-router-dom";

const InventoryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your products, track stock levels, and update pricing.
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Button
            variant="primary"
            onClick={() => navigate("/add-product")}
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Categories */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* Filter and Sort Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <ApperIcon name="Filter" className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
                {selectedCategory && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Category Selected
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none"
                    >
                      <ApperIcon name="X" className="h-2 w-2" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                    >
                      <ApperIcon name="X" className="h-2 w-2" />
                    </button>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">Sort by:</span>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="min-w-[140px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="price">Price Low-High</option>
                  <option value="stock">Stock Level</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Products List */}
          <ProductList
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;