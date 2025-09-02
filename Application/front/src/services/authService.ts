import API from "../API";

export const login = async (email: string, password: string) => {
  const res = await API.post("/auth/login", { email, password });
  const token = res.data.token;
  if (token) {
    localStorage.setItem("token", token);
    console.log("✅ Token saved to localStorage");
  } else {
    console.error("❌ No token found in response");
  }
  return res.data;
};
export const register = async (
  email: string,
  password: string,
  username: string
) => {
  const res = await API.post("/auth/register", { email, password, username });
  return res.data;
};
