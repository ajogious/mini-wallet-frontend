// Extracted FeaturesStatus Component
const FeaturesStatus = () => (
  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg text-white p-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-2">All Systems Operational</h3>
        <p className="text-green-100 text-sm">
          Fully functional Mini Wallet with real-time transactions and secure
          transfers.
        </p>
      </div>
      <div className="bg-white bg-opacity-20 rounded-full p-3">
        <svg
          className="h-6 w-6"
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
    </div>
  </div>
);

export default FeaturesStatus;
