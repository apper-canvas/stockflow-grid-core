import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApexChart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { priceHistoryService } from "@/services/api/priceHistoryService";
import { formatCurrency, formatDate } from "@/utils/formatters";

const PriceHistoryTimeline = ({ productId }) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productId) {
      loadPriceHistory();
    }
  }, [productId]);

  const loadPriceHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const historyData = await priceHistoryService.getByProductId(productId);
      setPriceHistory(historyData);
    } catch (err) {
      setError("Failed to load price history");
      console.error("Error loading price history:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2 text-primary-600" />
          Price History
        </h2>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2 text-primary-600" />
          Price History
        </h2>
        <Error message={error} />
      </div>
    );
  }

  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2 text-primary-600" />
          Price History
        </h2>
        <div className="text-center py-8">
          <ApperIcon name="BarChart3" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No price history available for this product</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = priceHistory.map(item => ({
    x: new Date(item.timestamp).getTime(),
    y: item.price
  }));

  const chartOptions = {
    chart: {
      type: 'line',
      height: 250,
      zoom: {
        enabled: true
      },
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#3498DB'],
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function(value) {
          const date = new Date(value);
          return date.toLocaleDateString();
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function(value) {
          return formatCurrency(value);
        }
      }
    },
    tooltip: {
      x: {
        formatter: function(value) {
          return formatDate(new Date(value));
        }
      },
      y: {
        formatter: function(value) {
          return formatCurrency(value);
        }
      }
    },
    grid: {
      strokeDashArray: 3
    },
    markers: {
      size: 4,
      hover: {
        size: 6
      }
    }
  };

  const series = [{
    name: 'Price',
    data: chartData
  }];

  // Calculate price statistics
  const prices = priceHistory.map(item => item.price);
  const currentPrice = prices[prices.length - 1] || 0;
  const previousPrice = prices[prices.length - 2] || currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? ((priceChange / previousPrice) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2 text-primary-600" />
        Price History
      </h2>

      {/* Price Stats */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Current Price</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(currentPrice)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Change</p>
          <p className={`text-lg font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {priceChange >= 0 ? '+' : ''}{formatCurrency(priceChange)}
            <span className="text-sm ml-1">
              ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(1)}%)
            </span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ApexChart
          options={chartOptions}
          series={series}
          type="line"
          height="100%"
        />
      </div>

      {/* Timeline Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{priceHistory.length} price changes</span>
          <span>
            From {formatDate(priceHistory[0]?.timestamp)} 
            to {formatDate(priceHistory[priceHistory.length - 1]?.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryTimeline;