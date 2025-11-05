import React, { useState } from "react";
import { transferService } from "../services/transferService";
import { useToast } from "../context/ToastContext";

const TransferFunds = ({ onTransferSuccess }) => {
  const [formData, setFormData] = useState({
    amount: "",
    recipientEmail: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point with max 2 decimal places
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        amount: value,
      }));

      // Clear amount error when user starts typing
      if (errors.amount) {
        setErrors({
          ...errors,
          amount: "",
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate recipient email
    if (!formData.recipientEmail) {
      newErrors.recipientEmail = "Recipient email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = "Recipient email is invalid";
    }

    // Validate amount
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      } else if (amount > 1000000) {
        // Limit to 1,000,000
        newErrors.amount = "Maximum transfer amount is ₦1,000,000";
      } else if (amount < 1) {
        newErrors.amount = "Minimum transfer amount is ₦1";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      const response = await transferService.transfer(
        amount,
        formData.recipientEmail
      );

      if (response.success) {
        addToast(
          `Successfully transferred ₦${amount.toLocaleString()} to ${
            response.recipientEmail
          }`,
          "success"
        );
        setFormData({
          amount: "",
          recipientEmail: "",
        });

        // Notify parent component to refresh data
        if (onTransferSuccess) {
          onTransferSuccess();
        }
      } else {
        addToast(response.message || "Transfer failed", "error");
      }
    } catch (err) {
      addToast(
        err.userMessage || "Transfer failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Transfer Funds
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Email */}
          <div>
            <label
              htmlFor="recipientEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipient Email
            </label>
            <input
              type="email"
              id="recipientEmail"
              name="recipientEmail"
              value={formData.recipientEmail}
              onChange={handleChange}
              placeholder="Enter recipient's email address"
              className={`block w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                errors.recipientEmail ? "border-red-300" : "border-gray-300"
              } disabled:opacity-50`}
              disabled={loading}
              required
            />
            {errors.recipientEmail && (
              <p className="mt-1 text-sm text-red-600">
                {errors.recipientEmail}
              </p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Amounts (₦)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: quickAmount.toString(),
                    }))
                  }
                  disabled={loading}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₦</span>
              </div>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className={`block w-full pl-7 pr-12 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                  errors.amount ? "border-red-300" : "border-gray-300"
                } disabled:opacity-50`}
                disabled={loading}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">NGN</span>
              </div>
            </div>
            {errors.amount ? (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                Enter amount between ₦1 and ₦1,000,000
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={
                loading ||
                !formData.amount ||
                !formData.recipientEmail ||
                parseFloat(formData.amount) <= 0
              }
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing Transfer...
                </>
              ) : (
                "Transfer Funds"
              )}
            </button>
          </div>
        </form>

        {/* Information Box */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">
                Important Notes
              </h4>
              <div className="text-sm text-yellow-700 mt-1 space-y-1">
                <p>• Recipient must be a registered user of Mini Wallet</p>
                <p>• Transfers are instant and cannot be reversed</p>
                <p>• Ensure you have sufficient balance before transferring</p>
                <p>• You cannot transfer funds to yourself</p>
                <p>• Maximum transfer amount: ₦1,000,000 per transaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferFunds;
