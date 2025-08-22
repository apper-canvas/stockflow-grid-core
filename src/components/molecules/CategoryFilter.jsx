import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";
import { cn } from "@/utils/cn";

const CategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange, 
  className,
  ...props 
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    const newCategory = categoryId === selectedCategory ? null : categoryId;
    if (onCategoryChange) {
      onCategoryChange(newCategory);
    }
  };

  if (loading) {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
      
      <button
        onClick={() => handleCategoryClick(null)}
        className={cn(
          "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
          !selectedCategory 
            ? "bg-primary-50 text-primary-700 font-medium" 
            : "text-gray-700 hover:bg-gray-50"
        )}
      >
        <ApperIcon name="Grid3X3" className="w-4 h-4" />
        <span>All Categories</span>
      </button>

      {categories.map((category) => (
        <button
          key={category.Id}
          onClick={() => handleCategoryClick(category.Id)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors",
            selectedCategory === category.Id 
              ? "bg-primary-50 text-primary-700 font-medium" 
              : "text-gray-700 hover:bg-gray-50"
          )}
        >
          <div className="flex items-center space-x-3">
            <ApperIcon name={category.icon} className="w-4 h-4" />
            <span>{category.name}</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {category.productCount}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;