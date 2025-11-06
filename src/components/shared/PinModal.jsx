import { useState, useRef, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";

const PinModal = ({
  isOpen,
  onClose,
  onVerify,
  title = "Enter PIN",
  description = "Please enter your 4-digit PIN to continue",
}) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setPin(["", "", "", ""]);
      setError("");
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  }, [isOpen]);

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit when all digits are entered
    if (newPin.every((digit) => digit !== "") && index === 3) {
      handleSubmit(newPin.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setPin(digits);
      inputRefs.current[3].focus();
    }
  };

  const handleSubmit = async (submittedPin = pin.join("")) => {
    if (submittedPin.length !== 4) {
      setError("Please enter a 4-digit PIN");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/wallet/verify-pin", {
        pin: submittedPin,
      });

      if (response.data.valid) {
        addToast("PIN verified successfully", "success");
        onVerify(submittedPin);
        onClose();
      } else {
        setError("Invalid PIN. Please try again.");
        setPin(["", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (err) {
      setError(err.userMessage || "PIN verification failed");
      setPin(["", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          </div>

          {/* PIN Input */}
          <div className="mt-6">
            <div className="flex justify-center space-x-3">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="password"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
              ))}
            </div>

            {error && (
              <p className="mt-2 text-center text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={loading || pin.join("").length !== 4}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
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
                  Verifying...
                </>
              ) : (
                "Verify PIN"
              )}
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-4 p-2 bg-yellow-50 rounded-md">
            <p className="text-xs text-yellow-700 text-center">
              For security, always verify your PIN before transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
