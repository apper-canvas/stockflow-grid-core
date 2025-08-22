import categoriesData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  // Simulate API delay
  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.categories];
  }

  async getById(id) {
    await this.delay();
    const category = this.categories.find(c => c.Id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  }

  async create(categoryData) {
    await this.delay();
    const maxId = Math.max(...this.categories.map(c => c.Id), 0);
    const newCategory = {
      ...categoryData,
      Id: maxId + 1,
      productCount: 0
    };
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, categoryData) {
    await this.delay();
    const index = this.categories.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    this.categories[index] = {
      ...this.categories[index],
      ...categoryData,
      Id: id
    };
    
    return { ...this.categories[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.categories.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    // Check if category has products
    const category = this.categories[index];
    if (category.productCount > 0) {
      throw new Error("Cannot delete category with existing products");
    }
    
    this.categories.splice(index, 1);
    return { success: true };
  }

  async updateProductCount(categoryId, count) {
    await this.delay();
    const category = this.categories.find(c => c.Id === categoryId);
    if (category) {
      category.productCount = count;
    }
    return category;
  }
}

export const categoryService = new CategoryService();