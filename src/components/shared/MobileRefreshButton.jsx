const MobileRefreshButton = ({ loading, onClick }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="w-full text-left flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <RefreshIcon loading={loading} mobile />
    {loading ? "Refreshing..." : "Refresh Data"}
  </button>
);

export default MobileRefreshButton;
