import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const ADMIN_EMAIL = "gsrinadh55@gmail.com";
const ADMIN_PASSWORD = "123456";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const adminEmail = localStorage.getItem("adminEmail");
    if (adminToken && adminEmail === ADMIN_EMAIL) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store admin session
        localStorage.setItem("adminToken", "admin_" + Date.now());
        localStorage.setItem("adminEmail", email);
        toast.success("Admin login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] to-[#EFE9DF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="font-heading text-4xl font-semibold text-[#3E2723]">Admin Portal</h1>
            <p className="text-[#5D4037]">Restricted access for store admin only</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-[#3E2723]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full px-4 py-3 border-2 border-[#E0D8C8] rounded-xl focus:border-[#D97736] focus:outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-[#3E2723]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-[#E0D8C8] rounded-xl focus:border-[#D97736] focus:outline-none transition-colors"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D97736] hover:bg-[#C96626] text-white rounded-xl h-12 font-semibold transition-transform hover:-translate-y-1"
            >
              {isLoading ? "Logging in..." : "Login as Admin"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-[#5D4037]">
            Not an admin?{" "}
            <Link to="/" className="text-[#D97736] hover:underline font-semibold">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
