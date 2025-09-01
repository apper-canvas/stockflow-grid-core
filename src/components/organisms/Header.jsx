import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ onSearch, onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const navigationItems = [
    { path: "/inventory", label: "Inventory", icon: "Package" },
    { path: "/categories", label: "Categories", icon: "Grid3X3" },
    { path: "/add-product", label: "Add Product", icon: "Plus" },
    { path: "/reports", label: "Reports", icon: "BarChart3" },
  ];

  const { logout } = useContext(AuthContext) || {};

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (onMobileMenuToggle) {
      onMobileMenuToggle(!isMobileMenuOpen);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Package" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">StockFlow Pro</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {onSearch && (
                <div className="hidden md:block">
                  <SearchBar onSearch={onSearch} />
                </div>
              )}
              
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/add-product")}
                className="hidden sm:flex"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Product
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/add-product")}
                className="sm:hidden"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex"
              >
                <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                Logout
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMobileMenuToggle}
                className="md:hidden"
              >
                <ApperIcon name="Menu" className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          {onSearch && (
            <div className="md:hidden pb-4">
              <SearchBar 
                placeholder="Search products..."
                onSearch={onSearch}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                    location.pathname === item.path
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap transition-colors md:hidden"
              >
                <ApperIcon name="LogOut" className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={handleMobileMenuToggle}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Package" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">StockFlow Pro</h1>
                </div>
              </div>
              <button
                onClick={handleMobileMenuToggle}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors",
                    location.pathname === item.path
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;