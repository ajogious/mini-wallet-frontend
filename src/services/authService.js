import api from "./api";

export const authService = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (loginData) => {
    const response = await api.post("/auth/login", loginData);
    return response.data;
  },

  verifyOTP: async (identifier, otp) => {
    const response = await api.post("/auth/verify-otp", { identifier, otp });
    return response.data;
  },

  resendOTP: async (identifier) => {
    const response = await api.post("/auth/resend-otp", { identifier });
    return response.data;
  },

  verifyBVN: async (bvnData) => {
    const response = await api.post("/auth/verify-bvn", bvnData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};
