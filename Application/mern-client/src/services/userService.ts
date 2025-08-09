import API from "../api";
import { getAuthToken } from "../utils/authToken";

export interface CurrentUser {
  email: string;
  username: string;
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const res = await API.get("/users/me", { headers: getAuthToken() });
  return res.data;
};

export const updateMe = async (username: string): Promise<CurrentUser> => {
  const res = await API.put(
    "/users/me",
    { username },
    { headers: getAuthToken() }
  );
  return res.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const res = await API.put(
    "/users/password",
    { currentPassword, newPassword },
    { headers: getAuthToken() }
  );
  return res.data as { message: string };
};
