import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { categoryService } from "@/services/api/categoryService";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "Package"
  });

  const iconOptions = [
    "Package", "Shirt", "Monitor", "Home", "Car", "Book", 
    "Coffee", "Smartphone", "Headphones", "Camera", "Gamepad2", "Heart"
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories. Please try again.");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.Id, formData);
        toast.success("Category updated successfully!");
        setCategories(categories.map(cat => 
          cat.Id === editingCategory.Id 
            ? { ...cat, ...formData }
            : cat
        ));
      } else {
        const newCategory = await categoryService.create(formData);
        toast.success("Category added successfully!");
        setCategories([...categories, newCategory]);
      }

      setFormData({ name: "", icon: "Package" });
      setShowAddForm(false);
      setEditingCategory(null);
    } catch (error) {
      toast.error(editingCategory ? "Failed to update category" : "Failed to add category");
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon
    });
    setShowAddForm(true);
  };

  const handleDelete = async (category) => {
    if (category.productCount > 0) {
      toast.error("Cannot delete category with existing products");
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await categoryService.delete(category.Id);
        setCategories(categories.filter(cat => cat.Id !== category.Id));
        toast.success("Category deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete category");
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setFormData({ name: "", icon: "Package" });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading rows={4} showHeader={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadCategories} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">
            Organize your products into categories for better management.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
            disabled={showAddForm}
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <ApperIcon name="Grid3X3" className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                required
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-2 rounded-lg border-2 transition-colors ${
                        formData.icon === icon
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <ApperIcon name={icon} className="w-4 h-4 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <Button type="submit" variant="primary">
                <ApperIcon name={editingCategory ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                {editingCategory ? "Update Category" : "Add Category"}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Empty
          title="No categories yet"
          description="Create categories to organize your products better."
          actionLabel="Add Category"
          onAction={() => setShowAddForm(true)}
          icon="Grid3X3"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.Id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name={category.icon} className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">
                      {category.productCount} products
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={category.productCount > 0}
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                ID: {category.Id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;