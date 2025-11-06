import LogoutButton from "../shared/LogoutButton";

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

export default UserSection;
