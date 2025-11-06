import Icon from "../ui/Icon";

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
export default LogoutButton;
