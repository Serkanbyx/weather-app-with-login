import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { validateLoginForm } from "../utils/validation";

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      await login(formData.email, formData.password);
      addToast("Login successful", "success");
      navigate("/");
    } catch (err) {
      const message = err.userMessage || "Login failed. Please try again.";
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-linear-to-br from-blue-600 via-indigo-700 to-purple-800 px-4 animate-fade-in">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {apiError && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2.5 text-gray-800 outline-none transition-all
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${errors.email ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2.5 text-gray-800 outline-none transition-all
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"}`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isSubmitting ? "Signing In..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
