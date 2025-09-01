import { toast } from 'react-toastify';

class ProductService {
  constructor() {
    this.tableName = 'product_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  ensureClient() {
    if (!this.apperClient) {
      this.initializeClient();
    }
    if (!this.apperClient) {
      throw new Error('ApperClient not initialized');
    }
  }

  async getAll() {
    try {
      this.ensureClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "barcode_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Transform database fields to frontend format
      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        description: item.description_c || '',
        price: item.price_c || 0,
        categoryId: item.category_id_c?.Id || item.category_id_c || null,
        barcode: item.barcode_c || '',
        quantity: item.quantity_c || 0,
        inStock: item.in_stock_c || false,
        imageUrl: item.image_url_c || '',
        createdAt: item.created_at_c || item.CreatedOn,
        updatedAt: item.updated_at_c || item.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      this.ensureClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "barcode_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error("Product not found");
      }
      
      // Transform database fields to frontend format
      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name,
        description: item.description_c || '',
        price: item.price_c || 0,
        categoryId: item.category_id_c?.Id || item.category_id_c || null,
        barcode: item.barcode_c || '',
        quantity: item.quantity_c || 0,
        inStock: item.in_stock_c || false,
        imageUrl: item.image_url_c || '',
        createdAt: item.created_at_c || item.CreatedOn,
        updatedAt: item.updated_at_c || item.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error);
      throw new Error("Product not found");
    }
  }

  async create(productData) {
    try {
      this.ensureClient();
      
      const params = {
        records: [{
          Name: productData.name,
          description_c: productData.description,
          price_c: parseFloat(productData.price) || 0,
          category_id_c: parseInt(productData.categoryId),
          barcode_c: productData.barcode,
          quantity_c: parseInt(productData.quantity) || 0,
          in_stock_c: productData.inStock || false,
          image_url_c: productData.imageUrl || '',
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create product");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            name: item.Name,
            description: item.description_c || '',
            price: item.price_c || 0,
            categoryId: item.category_id_c?.Id || item.category_id_c || null,
            barcode: item.barcode_c || '',
            quantity: item.quantity_c || 0,
            inStock: item.in_stock_c || false,
            imageUrl: item.image_url_c || '',
            createdAt: item.created_at_c || item.CreatedOn,
            updatedAt: item.updated_at_c || item.ModifiedOn
          };
        }
      }
      
      throw new Error("Failed to create product");
    } catch (error) {
      console.error("Error creating product:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, productData) {
    try {
      this.ensureClient();
      
      const params = {
        records: [{
          Id: id,
          Name: productData.name,
          description_c: productData.description,
          price_c: parseFloat(productData.price) || 0,
          category_id_c: parseInt(productData.categoryId),
          barcode_c: productData.barcode,
          quantity_c: parseInt(productData.quantity) || 0,
          in_stock_c: productData.inStock || false,
          image_url_c: productData.imageUrl || '',
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update product");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            name: item.Name,
            description: item.description_c || '',
            price: item.price_c || 0,
            categoryId: item.category_id_c?.Id || item.category_id_c || null,
            barcode: item.barcode_c || '',
            quantity: item.quantity_c || 0,
            inStock: item.in_stock_c || false,
            imageUrl: item.image_url_c || '',
            createdAt: item.created_at_c || item.CreatedOn,
            updatedAt: item.updated_at_c || item.ModifiedOn
          };
        }
      }
      
      throw new Error("Failed to update product");
    } catch (error) {
      console.error("Error updating product:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      this.ensureClient();
      
      const params = { 
        RecordIds: [id] 
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting product:", error?.response?.data?.message || error);
      return false;
    }
  }

  async bulkUpdatePrices(productIds, priceChange) {
    try {
      this.ensureClient();
      const updatedProducts = [];
      
      for (const productId of productIds) {
        try {
          const product = await this.getById(productId);
          if (product) {
            const newPrice = Math.max(0, product.price + priceChange);
            const updatedProduct = await this.update(productId, {
              ...product,
              price: newPrice
            });
            updatedProducts.push(updatedProduct);
          }
        } catch (error) {
          console.error(`Error updating product ${productId}:`, error);
        }
      }
      
      return updatedProducts;
    } catch (error) {
      console.error("Error bulk updating prices:", error?.response?.data?.message || error);
      return [];
    }
  }

  async searchProducts(query) {
    try {
      this.ensureClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "barcode_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "Name", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {"fieldName": "description_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {"fieldName": "barcode_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            }
          ]
        }],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Transform database fields to frontend format
      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        description: item.description_c || '',
        price: item.price_c || 0,
        categoryId: item.category_id_c?.Id || item.category_id_c || null,
        barcode: item.barcode_c || '',
        quantity: item.quantity_c || 0,
        inStock: item.in_stock_c || false,
        imageUrl: item.image_url_c || '',
        createdAt: item.created_at_c || item.CreatedOn,
        updatedAt: item.updated_at_c || item.ModifiedOn
      }));
    } catch (error) {
      console.error("Error searching products:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getProductsByCategory(categoryId) {
    try {
      this.ensureClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "barcode_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        where: [{"FieldName": "category_id_c", "Operator": "EqualTo", "Values": [parseInt(categoryId)]}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Transform database fields to frontend format
      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        description: item.description_c || '',
        price: item.price_c || 0,
        categoryId: item.category_id_c?.Id || item.category_id_c || null,
        barcode: item.barcode_c || '',
        quantity: item.quantity_c || 0,
        inStock: item.in_stock_c || false,
        imageUrl: item.image_url_c || '',
        createdAt: item.created_at_c || item.CreatedOn,
        updatedAt: item.updated_at_c || item.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching products by category:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export const productService = new ProductService();