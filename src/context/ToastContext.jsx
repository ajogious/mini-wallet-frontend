import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info", duration = 5000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const value = {
    toasts,
    addToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};
