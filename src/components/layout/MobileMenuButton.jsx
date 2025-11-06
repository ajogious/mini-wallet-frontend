import HamburgerIcon from "../shared/HamburgerIcon";

const MobileMenuButton = ({ isMobileMenuOpen, onToggle }) => (
  <div className="md:hidden flex items-center">
    <button
      onClick={onToggle}
      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      aria-expanded="false"
    >
      <span className="sr-only">Open main menu</span>
      <HamburgerIcon isOpen={isMobileMenuOpen} />
    </button>
  </div>
);

export default MobileMenuButton;
