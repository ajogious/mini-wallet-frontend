import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { walletService } from "../services/walletService";
import { transactionService } from "../services/transactionService";
import FundWallet from "../components/shared/FundWallet";
import TransferFunds from "../components/shared/TransferFunds";
import UpdatePinModal from "../components/shared/UpdatePinModal";
import Navigation from "../components/layout/Navigation";
import BalanceCard from "../components/dashboard/BalanceCard";
import FeaturesStatus from "../components/dashboard/FeaturesStatus";
import QuickStats from "../components/dashboard/QuickStats";
import SecuritySettings from "../components/dashboard/SecuritySettings";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import TransactionSection from "../components/dashboard/TransactionSection";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Context hooks
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  // State management
  const [balance, setBalance] = useState("0.00");
  const [transactions, setTransactions] = useState([]);
  const [walletLoading, setWalletLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [showUpdatePin, setShowUpdatePin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });

  // Effects
  useEffect(() => {
    fetchWalletData();
    fetchTransactions(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdate]);

  // Data fetching functions
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
    await fetchTransactions(newPage);
  };

  // Event handlers
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

  const handleUpdatePinSuccess = () => {
    addToast("PIN updated successfully!", "success");
    setShowUpdatePin(false);
  };

  const handleLogout = () => {
    addToast("Logged out successfully", "info");
    setTimeout(() => {
      logout();
    }, 500);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  // Derived values
  const creditTransactions = transactions.filter(
    (t) => t.transactionType === "CREDIT"
  );
  const debitTransactions = transactions.filter(
    (t) => t.transactionType === "DEBIT"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation
        user={user}
        refreshLoading={refreshLoading}
        isMobileMenuOpen={isMobileMenuOpen}
        onRefresh={handleManualRefresh}
        onUpdatePin={() => setShowUpdatePin(true)}
        onLogout={handleLogout}
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Welcome Banner */}
          <WelcomeBanner user={user} />
          {/* Verification Status Card */}
          {user?.verificationStatus !== "VERIFIED" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-yellow-800">
                    Account Verification Required
                  </h3>
                  <p className="text-yellow-700 mt-1">
                    You need to verify your BVN to activate your account and
                    start transactions.
                  </p>
                  <div className="mt-3">
                    <Link
                      to="/verify-bvn"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Verify BVN Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Account Status Card */}
          {user?.verificationStatus === "VERIFIED" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-green-400"
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
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-green-800">
                    Account Verified
                  </h3>
                  <p className="text-green-700 mt-1">
                    Your account is fully verified. Transaction limit:{" "}
                    {formatCurrency(user?.transactionLimit || 0)}
                  </p>
                  {user?.virtualAccountNumber && (
                    <p className="text-green-700 mt-1">
                      Virtual Account: {user.virtualAccountNumber} (
                      {user.bankName})
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Wallet Balance Card */}
          <BalanceCard
            balance={balance}
            walletLoading={walletLoading}
            formatCurrency={formatCurrency}
          />
          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FundWallet onDepositSuccess={handleDepositSuccess} />
            <TransferFunds onTransferSuccess={handleTransferSuccess} />
          </div>
          {/* Transaction History */}
          <TransactionSection
            transactions={transactions}
            transactionsLoading={transactionsLoading}
            pagination={pagination}
            onRefresh={() => fetchTransactions(0)}
            onPageChange={handlePageChange}
          />
          {/* Features Status */}
          <FeaturesStatus />
          {/* Quick Stats */}
          <QuickStats
            totalTransactions={pagination.totalElements}
            creditsCount={creditTransactions.length}
            debitsCount={debitTransactions.length}
          />
          {/* Security Settings */}
          <SecuritySettings onUpdatePin={() => setShowUpdatePin(true)} />
          {/* Update PIN Modal */}
          <UpdatePinModal
            isOpen={showUpdatePin}
            onClose={() => setShowUpdatePin(false)}
            onSuccess={handleUpdatePinSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
