import ActionButton from "./ActionButton";

const RefreshButton = ({ loading, onClick }) => (
  <ActionButton
    onClick={onClick}
    disabled={loading}
    icon={loading ? "spinner" : "refresh"}
    className="bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? "Refreshing..." : "Refresh"}
  </ActionButton>
);

export default RefreshButton;
