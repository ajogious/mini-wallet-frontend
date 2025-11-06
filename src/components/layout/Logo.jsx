const Logo = () => (
  <div className="flex-shrink-0 flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-8 w-8 text-blue-600"
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
    <h1 className="ml-2 text-xl font-bold text-gray-900">Mini Wallet</h1>
  </div>
);

export default Logo;
