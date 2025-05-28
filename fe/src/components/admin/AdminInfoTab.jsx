import React from "react";

const AdminInfoTab = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded shadow">
      {/* Quick introduction */}
      <p className="text-gray-600 mb-6">
        Chào mừng đến với hệ thống quản lý bán vé của bến xe Miền Đông! Hệ thống
        này được thiết kế để cung cấp cho người quản trị cái nhìn toàn diện và
        khả năng kiểm soát nền tảng. Tại đây, bạn có thể quản lý xe buýt, người
        dùng, chuyến đi và vé một cách hiệu quả. Bảng điều khiển đảm bảo hoạt
        động liền mạch và giúp duy trì tính toàn vẹn của hệ thống.
      </p>

      <h3 className="text-lg font-medium mb-4">Thông tin Admin</h3>

      <form>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Admin
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter admin name"
              value={user.name}
              readOnly
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter admin email"
              value={user.email}
              readOnly
            />
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter admin role"
              value={user.role}
              readOnly
            />
          </div>
        </div>{" "}
      </form>

      <img
        className="mt-5"
        src="https://thanhnien.mediacdn.vn/Uploaded/khanhtd/2022_10_09/d913c1cf13c4d49a8dd515-3329.jpg"
        alt=""
      />
    </div>
  );
};

export default AdminInfoTab;
