import api from "./api";

export const depositService = {
  deposit: async (amount) => {
    const response = await api.post("/wallet/deposit", { amount });
    return response.data;
  },
};
