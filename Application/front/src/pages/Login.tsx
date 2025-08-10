import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../context/AuthContext";

/**
 * Идея:
 * - не трогаем localStorage вручную
 * - зовём login() из контекста
 * - берём loading/error из state (для UX)
 * - после успеха — navigate("/dashboard")
 */

const Login = () => {
  const navigate = useNavigate();

  const { state, login } = useAuth();
  const { loading, error } = state; // loading/error даёт контекст

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // один источник истины: пусть контекст решает, когда мы залогинены
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password); // внутри: сохранит токен + подтянет me
    navigate("/dashboard");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {/* дружелюбная ошибка из контекста */}
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
