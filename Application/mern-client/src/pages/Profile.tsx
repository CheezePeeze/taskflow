import { useEffect, useState } from "react";
import {
  getCurrentUser,
  updateMe,
  changePassword,
  type CurrentUser,
} from "../services/userService";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const Profile = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const [userName, setUserName] = useState("");
  const [saving, setSaving] = useState(false);

  // states responsible for changing passwords
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  //Loading user profile
  useEffect(() => {
    (async () => {
      try {
        const me = await getCurrentUser();
        setUser(me);
        setUserName(me.username);
      } catch (error) {
        toast.error("Failed to load profile");
        console.error(error);
      }
    })();
  }, []);

  //Saving username

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim()) return toast.warn("Username cannot be empty");
    setSaving(true);
    try {
      const updated = await updateMe(userName.trim());
      setUser(updated);

      localStorage.setItem("user", JSON.stringify(updated));
      window.dispatchEvent(new Event("user-updated"));

      toast.success("Profile updated");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  //Change the password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword)
      return toast.warn("Fill both password fields");
    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message ?? "Failed to change password");
      console.error(err);
    } finally {
      setChangingPassword(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* Блок с email (только чтение) и username (редактируемый) */}
      <form onSubmit={handleSave} className="bg-white rounded shadow p-4 mb-6">
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            value={user?.email ?? ""}
            disabled
            className="w-full border rounded p-2 bg-gray-100 text-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Username</label>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Your username"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`px-4 py-2 rounded text-white ${
            saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>

      {/* Блок смены пароля */}
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
        <div className="mb-4">
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
