import { toast } from 'react-toastify';

class CategoryService {
  constructor() {
    this.tableName = 'category_c';
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
          {"field": {"Name": "parent_id_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "product_count_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
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
        parentId: item.parent_id_c || null,
        icon: item.icon_c || 'Box',
        productCount: item.product_count_c || 0
      }));
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
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
          {"field": {"Name": "parent_id_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "product_count_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error("Category not found");
      }
      
      // Transform database fields to frontend format
      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name,
        parentId: item.parent_id_c || null,
        icon: item.icon_c || 'Box',
        productCount: item.product_count_c || 0
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      throw new Error("Category not found");
    }
  }

  async create(categoryData) {
    try {
      this.ensureClient();
      
      const params = {
        records: [{
          Name: categoryData.name,
          parent_id_c: categoryData.parentId || null,
          icon_c: categoryData.icon || 'Box',
          product_count_c: 0
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
          throw new Error("Failed to create category");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            name: item.Name,
            parentId: item.parent_id_c || null,
            icon: item.icon_c || 'Box',
            productCount: item.product_count_c || 0
          };
        }
      }
      
      throw new Error("Failed to create category");
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, categoryData) {
    try {
      this.ensureClient();
      
      const params = {
        records: [{
          Id: id,
          Name: categoryData.name,
          parent_id_c: categoryData.parentId || null,
          icon_c: categoryData.icon || 'Box',
          product_count_c: categoryData.productCount || 0
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
          throw new Error("Failed to update category");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            name: item.Name,
            parentId: item.parent_id_c || null,
            icon: item.icon_c || 'Box',
            productCount: item.product_count_c || 0
          };
        }
      }
      
      throw new Error("Failed to update category");
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      this.ensureClient();
      
      // First check if category has products
      const category = await this.getById(id);
      if (category.productCount > 0) {
        toast.error("Cannot delete category with existing products");
        return false;
      }
      
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
      console.error("Error deleting category:", error?.response?.data?.message || error);
      return false;
    }
  }

  async updateProductCount(categoryId, count) {
    try {
      this.ensureClient();
      
      const category = await this.getById(categoryId);
      if (category) {
        return await this.update(categoryId, {
          ...category,
          productCount: count
        });
      }
      return null;
    } catch (error) {
      console.error("Error updating product count:", error?.response?.data?.message || error);
      return null;
    }
  }
}

export const categoryService = new CategoryService();