import React, { useState, useRef, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import { pinService } from "../../services/pinService";

const UpdatePinModal = ({ isOpen, onClose, onSuccess }) => {
  const [currentPin, setCurrentPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [step, setStep] = useState(1); // 1: Current PIN, 2: New PIN, 3: Confirm PIN
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentPinRefs = useRef([]);
  const newPinRefs = useRef([]);
  const confirmPinRefs = useRef([]);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      resetForm();
      if (currentPinRefs.current[0]) {
        currentPinRefs.current[0].focus();
      }
    }
  }, [isOpen]);

  const resetForm = () => {
    setCurrentPin(["", "", "", ""]);
    setNewPin(["", "", "", ""]);
    setConfirmPin(["", "", "", ""]);
    setStep(1);
    setError("");
    setLoading(false);
  };

  const handleInputChange = (pinType, index, value) => {
    if (!/^\d?$/.test(value)) return;

    const pinSetters = {
      current: setCurrentPin,
      new: setNewPin,
      confirm: setConfirmPin,
    };

    const pinRefs = {
      current: currentPinRefs,
      new: newPinRefs,
      confirm: confirmPinRefs,
    };

    const currentPinValue = pinSetters[pinType];
    const updatedPin = [
      ...(pinType === "current"
        ? currentPin
        : pinType === "new"
        ? newPin
        : confirmPin),
    ];
    updatedPin[index] = value;
    currentPinValue(updatedPin);

    // Auto-focus next input
    if (value && index < 3) {
      pinRefs[pinType].current[index + 1].focus();
    }

    // Auto-advance when all digits are entered
    if (updatedPin.every((digit) => digit !== "") && index === 3) {
      if (pinType === "current") {
        handleVerifyCurrentPin(updatedPin.join(""));
      } else if (pinType === "new") {
        setStep(3);
        setTimeout(() => {
          if (confirmPinRefs.current[0]) {
            confirmPinRefs.current[0].focus();
          }
        }, 100);
      } else if (pinType === "confirm") {
        handleUpdatePin(updatedPin.join(""));
      }
    }
  };

  const handleKeyDown = (pinType, index, e) => {
    if (
      e.key === "Backspace" &&
      !(
        pinType === "current"
          ? currentPin
          : pinType === "new"
          ? newPin
          : confirmPin
      )[index] &&
      index > 0
    ) {
      const refs =
        pinType === "current"
          ? currentPinRefs
          : pinType === "new"
          ? newPinRefs
          : confirmPinRefs;
      refs.current[index - 1].focus();
    }
  };

  const handleVerifyCurrentPin = async (submittedPin = currentPin.join("")) => {
    if (submittedPin.length !== 4) {
      setError("Please enter your current 4-digit PIN");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await pinService.verifyPin(submittedPin);

      if (response.valid) {
        setStep(2);
        setError("");
        setTimeout(() => {
          if (newPinRefs.current[0]) {
            newPinRefs.current[0].focus();
          }
        }, 100);
      } else {
        setError("Invalid current PIN. Please try again.");
        setCurrentPin(["", "", "", ""]);
        if (currentPinRefs.current[0]) {
          currentPinRefs.current[0].focus();
        }
      }
    } catch (err) {
      setError(err.userMessage || "PIN verification failed");
      setCurrentPin(["", "", "", ""]);
      if (currentPinRefs.current[0]) {
        currentPinRefs.current[0].focus();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePin = async (confirmedPin = confirmPin.join("")) => {
    const newPinValue = newPin.join("");

    if (newPinValue.length !== 4) {
      setError("Please enter a valid 4-digit new PIN");
      return;
    }

    if (confirmedPin.length !== 4) {
      setError("Please confirm your new 4-digit PIN");
      return;
    }

    if (newPinValue !== confirmedPin) {
      setError("New PIN and confirmation PIN do not match");
      setConfirmPin(["", "", "", ""]);
      if (confirmPinRefs.current[0]) {
        confirmPinRefs.current[0].focus();
      }
      return;
    }

    if (newPinValue === currentPin.join("")) {
      setError("New PIN cannot be the same as current PIN");
      setNewPin(["", "", "", ""]);
      setConfirmPin(["", "", "", ""]);
      setStep(2);
      setTimeout(() => {
        if (newPinRefs.current[0]) {
          newPinRefs.current[0].focus();
        }
      }, 100);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await pinService.updatePin(newPinValue);
      addToast("PIN updated successfully!", "success");
      onSuccess?.();
      onClose();
      resetForm();
    } catch (err) {
      setError(err.userMessage || "Failed to update PIN");
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Verify Current PIN";
      case 2:
        return "Enter New PIN";
      case 3:
        return "Confirm New PIN";
      default:
        return "Update PIN";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "Enter your current 4-digit PIN to continue";
      case 2:
        return "Enter your new 4-digit PIN";
      case 3:
        return "Confirm your new 4-digit PIN";
      default:
        return "";
    }
  };

  const renderPinInputs = (pinType, pinValue, refs) => {
    const labels = {
      current: "Current PIN",
      new: "New PIN",
      confirm: "Confirm PIN",
    };

    return (
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {labels[pinType]}
        </label>
        <div className="flex justify-center space-x-3">
          {pinValue.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (refs.current[index] = el)}
              type="password"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) =>
                handleInputChange(pinType, index, e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(pinType, index, e)}
              disabled={
                loading ||
                (pinType === "current" && step !== 1) ||
                (pinType === "new" && step !== 2) ||
                (pinType === "confirm" && step !== 3)
              }
              className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">
              {getStepTitle()}
            </h3>
            <p className="mt-2 text-sm text-gray-500">{getStepDescription()}</p>
          </div>

          {/* Progress Steps */}
          <div className="mt-4 flex justify-center">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepNumber === step
                        ? "bg-blue-600 text-white"
                        : stepNumber < step
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-8 h-1 ${
                        stepNumber < step ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PIN Inputs */}
          <div className="mt-6">
            {step === 1 &&
              renderPinInputs("current", currentPin, currentPinRefs)}
            {step === 2 && renderPinInputs("new", newPin, newPinRefs)}
            {step === 3 &&
              renderPinInputs("confirm", confirmPin, confirmPinRefs)}

            {error && (
              <p className="mt-3 text-center text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={() => {
                if (step === 1) {
                  onClose();
                  resetForm();
                } else {
                  setStep(step - 1);
                  setError("");
                }
              }}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            {step === 1 && (
              <button
                type="button"
                onClick={() => handleVerifyCurrentPin()}
                disabled={loading || currentPin.join("").length !== 4}
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
                  "Verify & Continue"
                )}
              </button>
            )}
          </div>

          {/* Security Tips */}
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              PIN Security Tips
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Don't use obvious numbers like 1234 or 0000</li>
              <li>• Don't share your PIN with anyone</li>
              <li>• Change your PIN regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePinModal;
