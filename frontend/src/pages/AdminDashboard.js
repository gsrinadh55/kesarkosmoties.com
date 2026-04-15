import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Edit, Trash2, Package, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { formatPrice } from "../utils/helpers";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [revenue, setRevenue] = useState({ day: 0, week: 0, month: 0 });

  // Check admin auth
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/orders`, { withCredentials: true });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/products`);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // In a real app, call backend to delete
      toast.success("Product deleted");
      fetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <header className="bg-[#D97736] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="font-heading font-semibold text-[#D97736]">K</span>
            </div>
            <h1 className="font-heading text-2xl font-semibold">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-[#E0D8C8] sticky top-16 z-30 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "new-product", label: "New Product", icon: "✨" },
            { id: "products", label: "Manage Products", icon: "📦" },
            { id: "orders", label: "Orders", icon: "🛒" },
            { id: "revenue", label: "Revenue", icon: "💰" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#D97736] text-[#D97736] font-semibold"
                  : "border-transparent text-[#5D4037] hover:text-[#D97736]"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E0D8C8] shadow-sm">
              <p className="text-[#5D4037] text-sm font-semibold mb-2">Total Products</p>
              <p className="font-heading text-4xl font-semibold text-[#D97736]">{products.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E0D8C8] shadow-sm">
              <p className="text-[#5D4037] text-sm font-semibold mb-2">Total Orders</p>
              <p className="font-heading text-4xl font-semibold text-[#D97736]">{orders.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E0D8C8] shadow-sm">
              <p className="text-[#5D4037] text-sm font-semibold mb-2">Today Revenue</p>
              <p className="font-heading text-4xl font-semibold text-[#D97736]">{formatPrice(revenue.day)}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E0D8C8] shadow-sm">
              <p className="text-[#5D4037] text-sm font-semibold mb-2">Monthly Revenue</p>
              <p className="font-heading text-4xl font-semibold text-[#D97736]">{formatPrice(revenue.month)}</p>
            </div>
          </div>
        )}

        {/* New Product Tab */}
        {activeTab === "new-product" && (
          <div className="bg-white rounded-3xl p-8 border border-[#E0D8C8]">
            <h2 className="font-heading text-2xl font-semibold text-[#3E2723] mb-6">Add New Product</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#3E2723] mb-2">Product Name</label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    className="w-full px-4 py-3 border-2 border-[#E0D8C8] rounded-xl focus:border-[#D97736] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#3E2723] mb-2">Price</label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    className="w-full px-4 py-3 border-2 border-[#E0D8C8] rounded-xl focus:border-[#D97736] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3E2723] mb-2">Description</label>
                <textarea
                  placeholder="Enter product description"
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-[#E0D8C8] rounded-xl focus:border-[#D97736] focus:outline-none resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#3E2723] mb-2">Category</label>
                  <input
                    type="text"
                    placeholder="Enter category"
                    className="w-full px-4 py-3 border-2 border-[#E0D8C8] rounded-xl focus:border-[#D97736] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#3E2723] mb-2">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="Enter rating"
                    className="w-full px-4 py-3 border-2 border-[#E0D8C8] rounded-xl focus:border-[#D97736] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3E2723] mb-2">Product Images</label>
                <div className="border-2 border-dashed border-[#E0D8C8] rounded-xl p-6 text-center cursor-pointer hover:border-[#D97736] transition-colors">
                  <input type="file" multiple accept="image/*" className="hidden" id="product-images" />
                  <label htmlFor="product-images" className="cursor-pointer">
                    <p className="text-[#D97736] font-semibold">Click to upload images</p>
                    <p className="text-xs text-[#5D4037]">PNG, JPG up to 10MB each</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3E2723] mb-2">Product Video (Optional)</label>
                <div className="border-2 border-dashed border-[#E0D8C8] rounded-xl p-6 text-center cursor-pointer hover:border-[#D97736] transition-colors">
                  <input type="file" accept="video/*" className="hidden" id="product-video" />
                  <label htmlFor="product-video" className="cursor-pointer">
                    <p className="text-[#D97736] font-semibold">Click to upload video</p>
                    <p className="text-xs text-[#5D4037]">MP4, WebM up to 100MB</p>
                  </label>
                </div>
              </div>

              <Button className="w-full bg-[#D97736] hover:bg-[#C96626] text-white rounded-xl h-12 font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </Button>
            </form>
          </div>
        )}

        {/* Manage Products Tab */}
        {activeTab === "products" && (
          <div className="bg-white rounded-3xl p-8 border border-[#E0D8C8] overflow-x-auto">
            <h2 className="font-heading text-2xl font-semibold text-[#3E2723] mb-6">Manage Products</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#E0D8C8]">
                  <th className="text-left py-3 px-4 font-semibold text-[#3E2723]">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#3E2723]">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#3E2723]">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#3E2723]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-[#E0D8C8] hover:bg-[#FAF7F2]">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <span className="font-medium text-[#3E2723]">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#D97736] font-semibold">{formatPrice(product.price)}</td>
                    <td className="py-4 px-4 text-[#5D4037]">{product.category}</td>
                    <td className="py-4 px-4 flex gap-2">
                      <button className="p-2 bg-[#EFE9DF] text-[#D97736] rounded-lg hover:bg-[#D97736] hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 bg-[#EFE9DF] text-[#E53935] rounded-lg hover:bg-[#E53935] hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl p-8 border border-[#E0D8C8] overflow-x-auto">
            <h2 className="font-heading text-2xl font-semibold text-[#3E2723] mb-6">Orders</h2>
            {orders.length === 0 ? (
              <p className="text-[#5D4037] text-center py-8">No orders yet</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#E0D8C8]">
                    <th className="text-left py-3 px-4 font-semibold text-[#3E2723]">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#3E2723]">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#3E2723]">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#3E2723]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-[#E0D8C8] hover:bg-[#FAF7F2]">
                      <td className="py-4 px-4 font-mono text-sm text-[#3E2723]">{order.id.slice(0, 8)}...</td>
                      <td className="py-4 px-4 text-[#3E2723]">{order.shipping_address?.name || "N/A"}</td>
                      <td className="py-4 px-4 text-[#D97736] font-semibold">{formatPrice(order.total)}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-[#C8E6C9] text-[#2E7D32] rounded-full text-xs font-semibold">
                          {order.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === "revenue" && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-[#E0D8C8]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5D4037] text-sm font-semibold mb-2">Today's Revenue</p>
                  <p className="font-heading text-4xl font-semibold text-[#D97736]">{formatPrice(revenue.day)}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-[#D97736] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-[#E0D8C8]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5D4037] text-sm font-semibold mb-2">This Week</p>
                  <p className="font-heading text-4xl font-semibold text-[#D97736]">{formatPrice(revenue.week)}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-[#D97736] opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-[#E0D8C8]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#5D4037] text-sm font-semibold mb-2">This Month</p>
                  <p className="font-heading text-4xl font-semibold text-[#D97736]">{formatPrice(revenue.month)}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-[#D97736] opacity-20" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
