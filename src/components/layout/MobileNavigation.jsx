import UserInfo from "./UserInfo";
import MobileRefreshButton from "../ui/RefreshButton";
import ActionButton from "../ui/ActionButton";
import LogoutButton from "../shared/LogoutButton";

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
export default MobileNavigation;
