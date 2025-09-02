import API from "../API";

export interface CurrentUser {
  email: string;
  username: string;
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const res = await API.get("/users/me");
  return res.data;
};

export const updateMe = async (username: string): Promise<CurrentUser> => {
  const res = await API.put("/users/me", { username });
  return res.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const res = await API.put("/users/password", {
    currentPassword,
    newPassword,
  });
  return res.data as { message: string };
};
