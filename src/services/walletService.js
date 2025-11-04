import api from "./api";

export const walletService = {
  getWallet: async () => {
    const response = await api.get("/wallet");

    return response.data;
  },

  getBalance: async () => {
    const response = await api.get("/wallet/balance");
    return response.data;
  },
};
