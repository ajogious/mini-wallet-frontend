import StatCard from "../ui/StatCard";

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

export default QuickStats;
