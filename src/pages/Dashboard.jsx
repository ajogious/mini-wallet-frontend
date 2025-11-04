import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { walletService } from "../services/walletService";
import { transactionService } from "../services/transactionService";
import TransactionTable from "../components/TransactionTable";
import Pagination from "../components/Pagination";
import FundWallet from "../components/FundWallet";
import TransferFunds from "../components/TransferFunds";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState("0.00");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchWalletData();
    fetchTransactions(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const fetchWalletData = async () => {
    try {
      const response = await walletService.getWallet();
      setBalance(response.balance);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (page = 0) => {
    setTransactionsLoading(true);
    try {
      const response = await transactionService.getTransactions(
        page,
        pagination.pageSize
      );
      setTransactions(response.content);
      setPagination((prev) => ({
        ...prev,
        currentPage: response.page,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchTransactions(newPage);
  };

  const handleDepositSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleTransferSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Mini Wallet</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.firstName}!</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Wallet Balance Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Current Balance
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loading ? "Loading..." : formatCurrency(balance)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fund Wallet Section */}
            <FundWallet onDepositSuccess={handleDepositSuccess} />

            {/* Transfer Funds Section */}
            <TransferFunds onTransferSuccess={handleTransferSuccess} />
          </div>

          {/* Transaction History */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h2>
              <div className="text-sm text-gray-500">
                {pagination.totalElements > 0 && (
                  <>Total: {pagination.totalElements} transactions</>
                )}
              </div>
            </div>

            <TransactionTable
              transactions={transactions}
              loading={transactionsLoading}
            />

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          {/* Features Preview */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="text-center">
              <svg
                className="mx-auto h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-semibold text-green-900">
                All Features Active!
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Your Mini Wallet is now fully functional with deposits and
                peer-to-peer transfers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
