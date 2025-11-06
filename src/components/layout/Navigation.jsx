import Logo from "./Logo";
import DesktopNavigation from "./DesktopNavigation";
import MobileMenuButton from "./MobileMenuButton";
import MobileNavigation from "../layout/MobileNavigation";

// Extracted Navigation Component
const Navigation = ({
  user,
  refreshLoading,
  isMobileMenuOpen,
  onRefresh,
  onUpdatePin,
  onLogout,
  onToggleMobileMenu,
}) => (
  <nav className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <DesktopNavigation
          user={user}
          refreshLoading={refreshLoading}
          onRefresh={onRefresh}
          onUpdatePin={onUpdatePin}
          onLogout={onLogout}
        />

        {/* Mobile menu button */}
        <MobileMenuButton
          isMobileMenuOpen={isMobileMenuOpen}
          onToggle={onToggleMobileMenu}
        />
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavigation
        user={user}
        refreshLoading={refreshLoading}
        isMobileMenuOpen={isMobileMenuOpen}
        onRefresh={onRefresh}
        onUpdatePin={onUpdatePin}
        onLogout={onLogout}
      />
    </div>
  </nav>
);

export default Navigation;
