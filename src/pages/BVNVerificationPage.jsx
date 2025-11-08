import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BVNVerification from "./BVNVerification";

const BVNVerificationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleVerificationComplete = (response) => {
    // Update user in context and localStorage
    const updatedUser = {
      ...user,
      verificationStatus: response.verificationStatus,
      transactionLimit: response.transactionLimit,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (user.verificationStatus === "VERIFIED") {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Account Verification
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Complete your verification to start using Mini Wallet
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div className="ml-2 text-sm font-medium text-gray-900">
                Registration
              </div>
            </div>
            <div className="w-12 h-1 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div className="ml-2 text-sm font-medium text-gray-900">
                BVN Verification
              </div>
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div className="ml-2 text-sm font-medium text-gray-500">
                Ready to Use
              </div>
            </div>
          </div>
        </div>

        {/* BVN Verification Component */}
        <BVNVerification
          user={user}
          onVerificationComplete={handleVerificationComplete}
        />

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Secure Transactions</h4>
            <p className="text-sm text-gray-600 mt-1">
              Bank-level security for all your transactions
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Higher Limits</h4>
            <p className="text-sm text-gray-600 mt-1">
              ₦5,000,000 transaction limit
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900">Virtual Account</h4>
            <p className="text-sm text-gray-600 mt-1">
              Get your dedicated account number
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BVNVerificationPage;
