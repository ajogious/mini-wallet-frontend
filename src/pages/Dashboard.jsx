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
