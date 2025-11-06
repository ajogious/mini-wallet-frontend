import Icon from "../ui/Icon";

const PinSetting = ({ onUpdatePin }) => (
  <div className="flex items-center justify-between">
    <div>
      <h4 className="text-sm font-medium text-gray-900">Wallet PIN</h4>
      <p className="text-sm text-gray-500">
        Update your 4-digit PIN for secure transactions
      </p>
    </div>
    <button
      onClick={onUpdatePin}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
    >
      <Icon name="pin" />
      Update PIN
    </button>
  </div>
);

export default PinSetting;
