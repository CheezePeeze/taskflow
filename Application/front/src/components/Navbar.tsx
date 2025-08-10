import { useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  // Берём всё из контекста
  const { state, logout } = useAuth();
  const { user, loading } = state;

  const handleLogout = () => {
    logout(); // чистит токен и стейт
    navigate("/"); // уводим на логин
  };

  return (
    <nav className="w-full bg-blue-600 text-white p-4 flex justify-between items-center">
      <div
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <h1 className="text-2xl font-bold">TaskFlow</h1>
      </div>

      {/* пока провайдер грузит профиль — не мигаем */}
      {!loading && user && (
        <div className="text-sm text-gray-200">
          👤 {user.username} ({user.email})
        </div>
      )}

      <div className="flex gap-4 items-center">
        <button
          className="hover:underline"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className="hover:underline"
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>
        <button onClick={handleLogout} className="hover:underline">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
