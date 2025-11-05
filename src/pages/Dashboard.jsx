import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { walletService } from "../services/walletService";
import { transactionService } from "../services/transactionService";
import TransactionTable from "../components/TransactionTable";
import Pagination from "../components/Pagination";
import FundWallet from "../components/FundWallet";
import TransferFunds from "../components/TransferFunds";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [balance, setBalance] = useState("0.00");
  const [transactions, setTransactions] = useState([]);
  const [walletLoading, setWalletLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Refresh data every 30 seconds to catch incoming transfers
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchWalletData();
    fetchTransactions(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdate]);

  const fetchWalletData = async () => {
    try {
      const response = await walletService.getWallet();
      setBalance(response.balance);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      addToast("Failed to load wallet balance", "error");
    } finally {
      setWalletLoading(false);
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
      addToast("Failed to load transactions", "error");
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    setTransactionsLoading(true);
    try {
      const response = await transactionService.getTransactions(
        newPage,
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
      addToast("Failed to load transactions", "error");
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleDepositSuccess = () => {
    addToast("Wallet funded successfully!", "success");
    setLastUpdate(Date.now());
  };

  const handleTransferSuccess = () => {
    addToast("Transfer completed successfully!", "success");
    setLastUpdate(Date.now());
  };

  const handleManualRefresh = async () => {
    setRefreshLoading(true);
    try {
      await Promise.all([fetchWalletData(), fetchTransactions(0)]);
      addToast("Data refreshed successfully", "success");
    } catch (error) {
      console.error("Error refreshing data:", error);
      addToast("Failed to refresh data", "error");
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleLogout = () => {
    addToast("Logged out successfully", "info");
    setTimeout(() => {
      logout();
    }, 500);
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
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg
                  className="h-8 w-8 text-blue-600"
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
                <h1 className="ml-2 text-xl font-bold text-gray-900">
                  Mini Wallet
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleManualRefresh}
                disabled={refreshLoading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refreshLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
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
                ) : (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                )}
                {refreshLoading ? "Refreshing..." : "Refresh"}
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Welcome, {user?.firstName}!
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Welcome Banner */}
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

          {/* Wallet Balance Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
                    <svg
                      className="h-8 w-8 text-white"
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
                  <div className="ml-5">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Current Balance
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {walletLoading ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2 text-blue-600"
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
                            Loading...
                          </div>
                        ) : (
                          formatCurrency(balance)
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Last updated</div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleTimeString()}
                  </div>
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
                <div className="text-sm text-gray-500">
                  {pagination.totalElements > 0 && (
                    <>Total: {pagination.totalElements} transactions</>
                  )}
                </div>
                <button
                  onClick={() => fetchTransactions(0)}
                  disabled={transactionsLoading}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors duration-200 disabled:opacity-50"
                >
                  {transactionsLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-1 h-4 w-4 text-blue-600"
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
                  ) : (
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  )}
                  {transactionsLoading ? "Refreshing..." : "Refresh"}
                </button>
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

          {/* Features Status */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  All Systems Operational
                </h3>
                <p className="text-green-100 text-sm">
                  Fully functional Mini Wallet with real-time transactions and
                  secure transfers.
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {pagination.totalElements}
              </div>
              <div className="text-sm text-gray-500">Total Transactions</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  transactions.filter((t) => t.transactionType === "CREDIT")
                    .length
                }
              </div>
              <div className="text-sm text-gray-500">Credits Received</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <div className="text-2xl font-bold text-red-600">
                {
                  transactions.filter((t) => t.transactionType === "DEBIT")
                    .length
                }
              </div>
              <div className="text-sm text-gray-500">Transfers Sent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
