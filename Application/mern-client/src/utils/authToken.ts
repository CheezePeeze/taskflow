// export const getAuthToken = () => {
//   const token = localStorage.getItem("token");
//   console.log(`Token:${token}`);

//   if (!token) throw new Error("No token found");
//   return {
//     Authorization: `Bearer ${token}`,
//   };
// };

// utils/authToken.ts
export const getToken = () => localStorage.getItem("token");
export const getAuthToken = () => {
  const token = getToken();
  if (!token) throw new Error("No token found");
  return { Authorization: `Bearer ${token}` };
};
