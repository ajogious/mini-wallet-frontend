import { useState } from "react";
import { depositService } from "../services/depositService";
import { useToast } from "../context/ToastContext";

const FundWallet = ({ onDepositSuccess }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate amount
      const depositAmount = parseFloat(amount.replace(/,/g, ""));
      if (isNaN(depositAmount) || depositAmount <= 0) {
        addToast("Please enter a valid amount greater than 0", "error");
        setLoading(false);
        return;
      }

      if (depositAmount > 1000000) {
        // Limit to 1,000,000
        addToast("Maximum deposit amount is ₦1,000,000", "error");
        setLoading(false);
        return;
      }

      const response = await depositService.deposit(depositAmount);

      if (response.success) {
        addToast(
          `Successfully deposited ₦${depositAmount.toLocaleString()}`,
          "success"
        );
        setAmount("");

        // Notify parent component to refresh data
        if (onDepositSuccess) {
          onDepositSuccess();
        }
      } else {
        addToast(response.message || "Deposit failed", "error");
      }
    } catch (err) {
      addToast(err.userMessage || "Deposit failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    let rawValue = e.target.value.replace(/,/g, ""); // remove commas

    // Allow only numbers and up to 2 decimal places
    if (!/^\d*\.?\d{0,2}$/.test(rawValue)) return;

    // Split integer and decimal parts
    const [integerPart, decimalPart] = rawValue.split(".");

    // Format integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Rebuild formatted value
    const formattedValue =
      decimalPart !== undefined
        ? `${formattedInteger}.${decimalPart}`
        : formattedInteger;

    setAmount(formattedValue);
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Fund Your Wallet
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                  onClick={() => setAmount(quickAmount.toLocaleString())}
                  disabled={loading}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Or Enter Custom Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₦</span>
              </div>
              <input
                type="text"
                id="amount"
                name="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50"
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">NGN</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Enter amount between ₦0.01 and ₦1,000,000
            </p>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Processing...
                </>
              ) : (
                "Deposit Funds"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FundWallet;
