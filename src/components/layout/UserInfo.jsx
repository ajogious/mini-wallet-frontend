const UserInfo = ({ user }) => (
  <div className="px-3 py-2">
    <p className="text-sm font-medium text-gray-900">
      Welcome, {user?.firstName}!
    </p>
    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
  </div>
);

export default UserInfo;
