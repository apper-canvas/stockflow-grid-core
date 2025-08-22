import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  onViewDetails,
  className,
  ...props 
}) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(product);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(product);
  };

  const handleCardClick = () => {
    if (onViewDetails) onViewDetails(product);
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer",
        className
      )} 
      onClick={handleCardClick}
      {...props}
    >
      <div className="flex items-start space-x-4">
        {/* Product Image */}
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

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <span>SKU: {product.barcode}</span>
                <span>•</span>
                <span>Qty: {product.quantity}</span>
              </div>
            </div>

            <div className="text-right ml-4">
              <div className="text-xl font-bold text-gray-900 mb-2">
                {formatCurrency(product.price)}
              </div>
              <Badge 
                variant={product.inStock ? "success" : "danger"}
                className="mb-3"
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
            >
              <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;