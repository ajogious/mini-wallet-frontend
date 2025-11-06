import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Extract clean error message from response
    if (error.response?.data) {
      const backendError = error.response.data;
      error.userMessage =
        backendError.message || backendError.error || "An error occurred";
    } else if (error.code === "NETWORK_ERROR") {
      error.userMessage = "Network error. Please check your connection.";
    } else if (error.code === "TIMEOUT_ERROR") {
      error.userMessage = "Request timeout. Please try again.";
    } else {
      error.userMessage = "An unexpected error occurred. Please try again.";
    }

    return Promise.reject(error);
  }
);

export default api;
