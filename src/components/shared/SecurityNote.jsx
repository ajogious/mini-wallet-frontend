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

export default SecurityNote;
