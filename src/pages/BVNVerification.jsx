import React, { useState } from "react";
import { useToast } from "../context/ToastContext";
import { authService } from "../services/authService";

const BVNVerification = ({ onVerificationComplete }) => {
  const [formData, setFormData] = useState({
    bvn: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bvn) {
      newErrors.bvn = "BVN is required";
    } else if (!/^\d{11}$/.test(formData.bvn)) {
      newErrors.bvn = "BVN must be exactly 11 digits";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
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
      const response = await authService.verifyBVN(formData);

      if (response.success) {
        addToast(
          "BVN verified successfully! Your account is now active.",
          "success"
        );
        onVerificationComplete(response);
      } else {
        addToast(response.message || "BVN verification failed", "error");
      }
    } catch (err) {
      addToast(err.userMessage || "BVN verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    // Convert DD-MM-YYYY to YYYY-MM-DD for input[type="date"]
    if (dateString && dateString.includes("-")) {
      const [day, month, year] = dateString.split("-");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateString;
  };

  const formatDateForSubmit = (dateString) => {
    // Convert YYYY-MM-DD to DD-MM-YYYY for backend
    if (dateString && dateString.includes("-")) {
      const [year, month, day] = dateString.split("-");
      return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
    }
    return dateString;
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Complete Your Verification
        </h3>

        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
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
                Account Verification Required
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                You need to verify your BVN to activate your account and start
                transactions.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* BVN Input */}
          <div>
            <label
              htmlFor="bvn"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              BVN (Bank Verification Number)
            </label>
            <input
              type="text"
              id="bvn"
              name="bvn"
              value={formData.bvn}
              onChange={handleChange}
              placeholder="Enter your 11-digit BVN"
              className={`block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.bvn ? "border-red-300" : "border-gray-300"
              } disabled:opacity-50`}
              disabled={loading}
              maxLength={11}
            />
            {errors.bvn && (
              <p className="mt-1 text-sm text-red-600">{errors.bvn}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Your BVN is required for account verification and security
            </p>
          </div>

          {/* Date of Birth Input */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth (as registered with your BVN)
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formatDateForInput(formData.dateOfBirth)}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  dateOfBirth: formatDateForSubmit(e.target.value),
                }));
                if (errors.dateOfBirth) {
                  setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
                }
              }}
              className={`block w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.dateOfBirth ? "border-red-300" : "border-gray-300"
              } disabled:opacity-50`}
              disabled={loading}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
                  Verifying BVN...
                </>
              ) : (
                "Verify BVN & Activate Account"
              )}
            </button>
          </div>
        </form>

        {/* Security Information */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Why we need your BVN?
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Verify your identity and prevent fraud</li>
            <li>• Comply with financial regulations</li>
            <li>• Enable banking transactions</li>
            <li>• Set your transaction limit to ₦5,000,000</li>
            <li>• Generate your virtual account number</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            Your BVN is encrypted and stored securely. We do not share your data
            with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BVNVerification;
