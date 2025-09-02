// src/pages/Profile.tsx
import { useEffect, useMemo, useState } from "react";
import { changePassword } from "../services/userService"; // смена пароля пока остаётся сервисом
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import useAuth from "../context/AuthContext";

const Profile = () => {
  // 1) Берём состояние и экшены из нашего "офиса" (контекста)
  const { state, setUserName, refreshUser } = useAuth();
  const { user, loading } = state;

  // 2) Локальные стейты — только то, что действительно локально этому экрану
  const [userName, setUserNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  // стейты для смены пароля — это локальная форма, ок
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // 3) Когда user появляется/обновляется в контексте — синхронизируем поле ввода
  useEffect(() => {
    if (user) setUserNameInput(user.username);
  }, [user]);

  // 4) Кнопку "Save" можно дизейблить, если ничего не поменяли
  const isNameChanged = useMemo(
    () => (user ? userName.trim() !== user.username : false),
    [user, userName]
  );

  // 5) Сохранение имени пользователя
  // ЛОГИКА: не дергаем сервис вручную — просим контекст сделать это правильно и централизованно
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return toast.warn("Username cannot be empty");
    if (!isNameChanged) return; // ничего не меняем — ничего не шлём

    setSaving(true);
    try {
      await setUserName(userName.trim()); // контекст сам вызовет updateMe и обновит state.user
      toast.success("Profile updated");
      // при желании: await refreshUser(); — если хочешь насильно подтянуть свежие данные с сервера
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // 6) Смена пароля
  // Перед тем как шить на сервер — базовая валидация на клиенте
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword)
      return toast.warn("Fill both password fields");
    if (newPassword !== confirmPassword)
      return toast.warn("Passwords do not match");

    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message ?? "Failed to change password");
      console.error(err);
    } finally {
      setChangingPassword(false);
    }
  };

  // 7) Пока контекст ещё грузится (первая подгрузка me) — можно показать плейсхолдер/скелетон
  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="bg-white rounded shadow p-4 mb-6 animate-pulse h-40" />
        <div className="bg-white rounded shadow p-4 animate-pulse h-56" />
      </div>
    );
  }

  // 8) Если user всё ещё нет — значит не авторизованы (или токен умер и нас разлогинили в интерсепторе)
  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <p className="text-gray-600">You are not logged in.</p>
      </div>
    );
  }

  // 9) Основная разметка
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* Email (read-only) + Username (editable) */}
      <form onSubmit={handleSave} className="bg-white rounded shadow p-4 mb-6">
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            value={user.email}
            disabled
            className="w-full border rounded p-2 bg-gray-100 text-gray-600"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm text-gray-600 mb-1">Username</label>
          <input
            value={userName}
            onChange={(e) => setUserNameInput(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Your username"
          />
        </div>

        {/* Подсказка, если имя не менялось */}
        {!isNameChanged && (
          <p className="text-xs text-gray-500 mb-4">
            Tip: change the username to enable saving.
          </p>
        )}

        <button
          type="submit"
          disabled={saving || !isNameChanged}
          className={`px-4 py-2 rounded text-white ${
            saving || !isNameChanged
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      {/* Change password */}
      <form
        onSubmit={handleChangePassword}
        className="bg-white rounded shadow p-4"
      >
        <h2 className="text-lg font-semibold mb-4">Change password</h2>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            Current password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Current password"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">
            New password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="New password"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Confirm new password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Repeat new password"
          />
        </div>

        <button
          type="submit"
          disabled={changingPassword}
          className={`px-4 py-2 rounded text-white ${
            changingPassword
              ? "bg-gray-400"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {changingPassword ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
