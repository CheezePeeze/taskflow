import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../context/AuthContext";

/**
 * Idea:
 * - don't touch localStorage manually
 * - call login() from context
 * - take loading/error from state (for UX)
 * - after success - navigate(“/dashboard”)
 */

const Login = () => {
  const navigate = useNavigate();

  const { state, login } = useAuth();
  const { loading, error } = state; // loading/error gives context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // one source of truth: let context decide when we are logged in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password); // inside: save token + pull me up
    navigate("/dashboard");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <div className="mb-3 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-center mt-4">
          No account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
