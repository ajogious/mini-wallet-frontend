import PinSetting from "../../components/layout/PinSetting";
import SecurityNote from "../../components/shared/SecurityNote";

// Extracted SecuritySettings Component
const SecuritySettings = ({ onUpdatePin }) => (
  <div className="bg-white shadow rounded-lg border border-gray-200">
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Security Settings
      </h3>
      <div className="space-y-4">
        <PinSetting onUpdatePin={onUpdatePin} />
        <SecurityNote />
      </div>
    </div>
  </div>
);
export default SecuritySettings;
