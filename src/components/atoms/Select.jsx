import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className, 
  label,
  error,
  required = false,
  children,
  ...props 
}, ref) => {
  const selectClasses = cn(
    "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900",
    "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
    error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
    className
  );

  if (label) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <select
      ref={ref}
      className={selectClasses}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;