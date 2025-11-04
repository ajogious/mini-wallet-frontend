import api from "./api";

export const transactionService = {
  getTransactions: async (page = 0, size = 10) => {
    const response = await api.get(`/transactions?page=${page}&size=${size}`);
    return response.data;
  },

  getAllTransactions: async () => {
    const response = await api.get("/transactions/all");
    return response.data;
  },
};
