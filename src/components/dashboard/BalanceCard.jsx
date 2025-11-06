import LastUpdated from "../../components/layout/LastUpdated";
import LoadingIndicator from "../ui/LoadingIndicator";

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
export default BalanceCard;
