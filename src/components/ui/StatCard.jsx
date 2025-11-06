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
export default StatCard;
