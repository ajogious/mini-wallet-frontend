const LastUpdated = () => (
  <div className="text-right">
    <div className="text-sm text-gray-500">Last updated</div>
    <div className="text-sm font-medium text-gray-900">
      {new Date().toLocaleTimeString()}
    </div>
  </div>
);

export default LastUpdated;
