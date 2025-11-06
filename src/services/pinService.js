import api from "./api";

export const pinService = {
  updatePin: async (newPin) => {
    const response = await api.post("/wallet/update-pin", { pin: newPin });
    return response.data;
  },

  verifyPin: async (pin) => {
    const response = await api.post("/wallet/verify-pin", { pin });
    return response.data;
  },

  getCurrentPin: async () => {
    const response = await api.get("/wallet/pin-status");
    console.log(response.data);

    return response.data;
  },
};
