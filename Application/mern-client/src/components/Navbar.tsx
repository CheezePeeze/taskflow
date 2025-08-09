import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type CurrentUser, getCurrentUser } from "../services/userService";
import { safeJsonParse } from "../utils/safeJsonParse";

const Navbar = () => {
  const [user, setUser] = useState<{ email: string; username: string } | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      // 1) Попробуем взять кэш, чтобы не мигало
      const cached = safeJsonParse<CurrentUser>(localStorage.getItem("user"));

      if (cached) setUser(cached);

      // 2) А потом обновим из API (истина — на сервере)
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (e) {
        console.error("Error fetching user info", e);
      }
    };

    // 🔔 слушаем событие от Profile
    const onUserUpdated = () => {
      const cached = safeJsonParse<CurrentUser>(localStorage.getItem("user"));
      if (cached) setUser(cached);
    };
    load();
    window.addEventListener("user-updated", onUserUpdated);

    return () => window.removeEventListener("user-updated", onUserUpdated);
  }, []);
  //   useEffect(() => {
  //   const token = localStorage.getItem("token");
  // if (!token) return;
  // (async () => {
  //   try {
  //     const userData = await getCurrentUser();
  //     setUser(userData);
  //   } catch (error) {
  //     console.error("Error fetching user info", error);
  //   }
  // })();
  //   }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <nav className="w-full bg-blue-600 text-white p-4 flex justify-between items-center">
      <div
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <h1 className="text-2xl font-bold">TaskFlow</h1>
      </div>

      {user && (
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
