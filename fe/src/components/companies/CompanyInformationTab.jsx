// Company Information Tab Content
const CompanyInformationTab = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-medium mb-4">Chi tiết nhà xe</h3>

      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên nhà xe
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter company name"
              value={user.name}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Người đại diện
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter registration number"
              value={user.representative}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter contact email"
              value={user.email}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điện thoại
            </label>
            <input
              type="tel"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter phone number"
              value={user.phone_number}
              readOnly
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <textarea
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              rows="3"
              placeholder="Enter company address"
              value={user.address}
              readOnly
            ></textarea>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyInformationTab;
