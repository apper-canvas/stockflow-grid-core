import productsData from "@/services/mockData/products.json";

class ProductService {
  constructor() {
    this.products = [...productsData];
  }

  // Simulate API delay
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.products];
  }

  async getById(id) {
    await this.delay();
    const product = this.products.find(p => p.Id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  }

  async create(productData) {
    await this.delay();
    const maxId = Math.max(...this.products.map(p => p.Id), 0);
    const newProduct = {
      ...productData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.products.push(newProduct);
    return { ...newProduct };
  }

  async update(id, productData) {
    await this.delay();
    const index = this.products.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    this.products[index] = {
      ...this.products[index],
      ...productData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.products[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.products.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    
    this.products.splice(index, 1);
    return { success: true };
  }

  async bulkUpdatePrices(productIds, priceChange) {
    await this.delay();
    const updatedProducts = [];
    
    for (const productId of productIds) {
      const product = this.products.find(p => p.Id === productId);
      if (product) {
        const newPrice = Math.max(0, product.price + priceChange);
        product.price = newPrice;
        product.updatedAt = new Date().toISOString();
        updatedProducts.push({ ...product });
      }
    }
    
    return updatedProducts;
  }

  async searchProducts(query) {
    await this.delay();
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.barcode.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getProductsByCategory(categoryId) {
    await this.delay();
    return this.products.filter(product => product.categoryId === categoryId);
  }
}

export const productService = new ProductService();