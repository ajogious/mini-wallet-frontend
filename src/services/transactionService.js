/* eslint-disable no-useless-catch */
import api from "./api";

export const transactionService = {
  getTransactions: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/transactions?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllTransactions: async () => {
    try {
      const response = await api.get("/transactions/all");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
