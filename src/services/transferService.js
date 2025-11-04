import api from "./api";

export const transferService = {
  transfer: async (amount, recipientEmail) => {
    const response = await api.post("/wallet/transfer", {
      amount,
      recipientEmail,
    });
    return response.data;
  },
};
