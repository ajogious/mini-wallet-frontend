import api from "./api";

export const transferService = {
  transfer: async (amount, recipientEmail, pin) => {
    const response = await api.post("/wallet/transfer", {
      amount,
      recipientEmail,
      pin,
    });
    return response.data;
  },
};
