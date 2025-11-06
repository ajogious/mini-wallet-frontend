import RefreshTransactionButton from "../ui/RefreshTransactionButton";

const TransactionHeader = ({ totalElements, loading, onRefresh }) => (
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
      <svg
        className="w-5 h-5 mr-2 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      Transaction History
    </h2>
    <div className="flex items-center space-x-4">
      {totalElements > 0 && (
        <div className="text-sm text-gray-500">
          Total: {totalElements} transactions
        </div>
      )}
      <RefreshTransactionButton loading={loading} onRefresh={onRefresh} />
    </div>
  </div>
);

export default TransactionHeader;
