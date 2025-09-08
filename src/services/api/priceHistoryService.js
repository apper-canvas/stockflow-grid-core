import { toast } from "react-toastify";

class PriceHistoryService {
  constructor() {
    this.tableName = 'price_history_c';
    this.apperClient = null;
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
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
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
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
      
      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        productId: item.product_id_c?.Id || item.product_id_c || null,
        productName: item.product_id_c?.Name || '',
        price: item.price_c || 0,
        timestamp: item.timestamp_c
      }));
    } catch (error) {
      console.error("Error fetching price history:", error?.response?.data?.message || error);
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
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "timestamp_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        throw new Error("Price history record not found");
      }
      
      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name,
        productId: item.product_id_c?.Id || item.product_id_c || null,
        productName: item.product_id_c?.Name || '',
        price: item.price_c || 0,
        timestamp: item.timestamp_c
      };
    } catch (error) {
      console.error(`Error fetching price history ${id}:`, error?.response?.data?.message || error);
      throw new Error("Price history record not found");
    }
  }

  async getByProductId(productId) {
    try {
      this.ensureClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "timestamp_c"}}
        ],
        where: [{"FieldName": "product_id_c", "Operator": "EqualTo", "Values": [parseInt(productId)]}],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "ASC"}],
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
      
      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        productId: item.product_id_c?.Id || item.product_id_c || null,
        productName: item.product_id_c?.Name || '',
        price: item.price_c || 0,
        timestamp: item.timestamp_c
      }));
    } catch (error) {
      console.error(`Error fetching price history for product ${productId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async create(priceHistoryData) {
    try {
      this.ensureClient();
      
      const params = {
        records: [{
          Name: priceHistoryData.name,
          product_id_c: parseInt(priceHistoryData.productId),
          price_c: parseFloat(priceHistoryData.price) || 0,
          timestamp_c: priceHistoryData.timestamp || new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} price history records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create price history record");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            name: item.Name,
            productId: item.product_id_c?.Id || item.product_id_c || null,
            productName: item.product_id_c?.Name || '',
            price: item.price_c || 0,
            timestamp: item.timestamp_c
          };
        }
      }
      
      throw new Error("Failed to create price history record");
    } catch (error) {
      console.error("Error creating price history:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, priceHistoryData) {
    try {
      this.ensureClient();
      
      const params = {
        records: [{
          Id: id,
          Name: priceHistoryData.name,
          product_id_c: parseInt(priceHistoryData.productId),
          price_c: parseFloat(priceHistoryData.price) || 0,
          timestamp_c: priceHistoryData.timestamp
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
          console.error(`Failed to update ${failed.length} price history records:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update price history record");
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            name: item.Name,
            productId: item.product_id_c?.Id || item.product_id_c || null,
            productName: item.product_id_c?.Name || '',
            price: item.price_c || 0,
            timestamp: item.timestamp_c
          };
        }
      }
      
      throw new Error("Failed to update price history record");
    } catch (error) {
      console.error("Error updating price history:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} price history records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting price history:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const priceHistoryService = new PriceHistoryService();