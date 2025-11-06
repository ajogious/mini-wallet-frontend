import ActionButton from "../ui/ActionButton";
import RefreshButton from "../ui/RefreshButton";
import UserSection from "../ui/UserSection";

const DesktopNavigation = ({
  user,
  refreshLoading,
  onRefresh,
  onUpdatePin,
  onLogout,
}) => (
  <div className="hidden md:flex items-center space-x-4">
    <ActionButton
      onClick={onUpdatePin}
      icon="pin"
      className="bg-purple-600 hover:bg-purple-700 text-white"
    >
      Update PIN
    </ActionButton>

    <RefreshButton loading={refreshLoading} onClick={onRefresh} />

    <UserSection user={user} onLogout={onLogout} />
  </div>
);
export default DesktopNavigation;
