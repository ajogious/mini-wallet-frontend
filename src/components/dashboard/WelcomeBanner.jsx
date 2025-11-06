// Extracted WelcomeBanner Component
const WelcomeBanner = ({ user }) => (
  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg text-white p-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName} {user?.lastName}!
        </h1>
        <p className="text-blue-100">
          Manage your finances with ease using Mini Wallet
        </p>
      </div>
      <div className="bg-white bg-opacity-20 rounded-full p-3">
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      </div>
    </div>
  </div>
);

export default WelcomeBanner;
