import TransactionHeader from "../layout/TransactionHeader";
import TransactionTable from "../shared/TransactionTable";
import Pagination from "../shared/Pagination";

const TransactionSection = ({
  transactions,
  transactionsLoading,
  pagination,
  onRefresh,
  onPageChange,
}) => (
  <div className="space-y-4">
    <TransactionHeader
      totalElements={pagination.totalElements}
      loading={transactionsLoading}
      onRefresh={onRefresh}
    />

    <TransactionTable
      transactions={transactions}
      loading={transactionsLoading}
    />

    {pagination.totalPages > 1 && (
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    )}
  </div>
);

export default TransactionSection;
