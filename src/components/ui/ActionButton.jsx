import Icon from "../ui/Icon";

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

export default ActionButton;
