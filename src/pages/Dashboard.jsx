import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { walletService } from "../services/walletService";
import { transactionService } from "../services/transactionService";
import TransactionTable from "../components/TransactionTable";
import Pagination from "../components/Pagination";
import FundWallet from "../components/FundWallet";
import TransferFunds from "../components/TransferFunds";
import UpdatePinModal from "../components/UpdatePinModal";

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

// Extracted Navigation Component
const Navigation = ({
  user,
  refreshLoading,
  isMobileMenuOpen,
  onRefresh,
  onUpdatePin,
  onLogout,
  onToggleMobileMenu,
}) => (
  <nav className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <DesktopNavigation
          user={user}
          refreshLoading={refreshLoading}
          onRefresh={onRefresh}
          onUpdatePin={onUpdatePin}
          onLogout={onLogout}
        />

        {/* Mobile menu button */}
        <MobileMenuButton
          isMobileMenuOpen={isMobileMenuOpen}
          onToggle={onToggleMobileMenu}
        />
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavigation
        user={user}
        refreshLoading={refreshLoading}
        isMobileMenuOpen={isMobileMenuOpen}
        onRefresh={onRefresh}
        onUpdatePin={onUpdatePin}
        onLogout={onLogout}
      />
    </div>
  </nav>
);

const Logo = () => (
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
    <h1 className="ml-2 text-xl font-bold text-gray-900">Mini Wallet</h1>
  </div>
);

const DesktopNavigation = ({
  user,
  refreshLoading,
  onRefresh,
  onUpdatePin,
  onLogout,
}) => (
  <div className="hidden md:flex items-center space-x-4">
    <ActionButton
      onClick={onUpdatePin}
      icon="pin"
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      Update PIN
    </ActionButton>

    <RefreshButton loading={refreshLoading} onClick={onRefresh} />

    <UserSection user={user} onLogout={onLogout} />
  </div>
);

const MobileMenuButton = ({ isMobileMenuOpen, onToggle }) => (
  <div className="md:hidden flex items-center">
    <button
      onClick={onToggle}
      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      aria-expanded="false"
    >
      <span className="sr-only">Open main menu</span>
      <HamburgerIcon isOpen={isMobileMenuOpen} />
    </button>
  </div>
);

const HamburgerIcon = ({ isOpen }) => (
  <>
    <svg
      className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
    <svg
      className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </>
);

const MobileNavigation = ({
  user,
  refreshLoading,
  isMobileMenuOpen,
  onRefresh,
  onUpdatePin,
  onLogout,
}) => (
  <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
      <UserInfo user={user} />
      <MobileRefreshButton loading={refreshLoading} onClick={onRefresh} />
      <ActionButton
        onClick={onUpdatePin}
        icon="pin"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Update PIN
      </ActionButton>
      <LogoutButton onClick={onLogout} mobile />
    </div>
  </div>
);

const UserInfo = ({ user }) => (
  <div className="px-3 py-2">
    <p className="text-sm font-medium text-gray-900">
      Welcome, {user?.firstName}!
    </p>
    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
  </div>
);

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

const UserSection = ({ user, onLogout }) => (
  <div className="flex items-center space-x-3">
    <div className="text-right">
      <p className="text-sm font-medium text-gray-900">
        Welcome, {user?.firstName}!
      </p>
      <p className="text-xs text-gray-500">{user?.email}</p>
    </div>
    <LogoutButton onClick={onLogout} />
  </div>
);

const LogoutButton = ({ onClick, mobile = false }) => {
  const baseClass = mobile
    ? "w-full text-left flex items-center px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
    : "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center";

  return (
    <button onClick={onClick} className={baseClass}>
      <Icon name="logout" />
      Logout
    </button>
  );
};

const ActionButton = ({ onClick, disabled, icon, className, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${className}`}
  >
    <Icon name={icon} />
    {children}
  </button>
);

const Icon = ({ name }) => {
  const icons = {
    pin: (
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
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    refresh: (
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
    ),
    spinner: (
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
    ),
    logout: (
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
    ),
  };

  return icons[name] || null;
};

const RefreshIcon = ({ loading, mobile = false }) => {
  const sizeClass = mobile ? "h-5 w-5" : "h-4 w-4";

  if (loading) {
    return (
      <svg
        className={`animate-spin -ml-1 mr-3 ${sizeClass} text-gray-700`}
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
    );
  }

  return (
    <svg
      className={`${sizeClass} mr-3`}
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
  );
};

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

// Extracted BalanceCard Component
const BalanceCard = ({ balance, walletLoading, formatCurrency }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
    <div className="px-4 py-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8 text-white"
            >
              {/* Circle background */}
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              {/* Naira symbol inside */}
              <line
                x1="6"
                y1="9.5"
                x2="18"
                y2="9.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="6"
                y1="14.5"
                x2="18"
                y2="14.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="9"
                y1="6"
                x2="9"
                y2="18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="9"
                y1="6"
                x2="15"
                y2="18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="15"
                y1="6"
                x2="15"
                y2="18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="ml-5">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Current Balance
              </dt>
              <dd className="text-2xl font-bold text-gray-900">
                {walletLoading ? <LoadingIndicator /> : formatCurrency(balance)}
              </dd>
            </dl>
          </div>
        </div>
        <LastUpdated />
      </div>
    </div>
  </div>
);

const LoadingIndicator = () => (
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
);

const LastUpdated = () => (
  <div className="text-right">
    <div className="text-sm text-gray-500">Last updated</div>
    <div className="text-sm font-medium text-gray-900">
      {new Date().toLocaleTimeString()}
    </div>
  </div>
);

// Extracted TransactionSection Component
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

const RefreshTransactionButton = ({ loading, onRefresh }) => (
  <button
    onClick={onRefresh}
    disabled={loading}
    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors duration-200 disabled:opacity-50"
  >
    {loading ? (
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
    {loading ? "Refreshing..." : "Refresh"}
  </button>
);

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

// Extracted QuickStats Component
const QuickStats = ({ totalTransactions, creditsCount, debitsCount }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <StatCard
      value={totalTransactions}
      label="Total Transactions"
      color="blue"
    />
    <StatCard value={creditsCount} label="Credits Received" color="green" />
    <StatCard value={debitsCount} label="Transfers Sent" color="red" />
  </div>
);

const StatCard = ({ value, label, color }) => {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
};

// Extracted SecuritySettings Component
const SecuritySettings = ({ onUpdatePin }) => (
  <div className="bg-white shadow rounded-lg border border-gray-200">
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Security Settings
      </h3>
      <div className="space-y-4">
        <PinSetting onUpdatePin={onUpdatePin} />
        <SecurityNote />
      </div>
    </div>
  </div>
);

const PinSetting = ({ onUpdatePin }) => (
  <div className="flex items-center justify-between">
    <div>
      <h4 className="text-sm font-medium text-gray-900">Wallet PIN</h4>
      <p className="text-sm text-gray-500">
        Update your 4-digit PIN for secure transactions
      </p>
    </div>
    <button
      onClick={onUpdatePin}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
    >
      <Icon name="pin" />
      Update PIN
    </button>
  </div>
);

const SecurityNote = () => (
  <div className="border-t border-gray-200 pt-4">
    <div className="flex items-center text-sm text-gray-500">
      <svg
        className="w-4 h-4 mr-2 text-green-500"
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
      PIN is required for all money transfers
    </div>
  </div>
);

export default Dashboard;
