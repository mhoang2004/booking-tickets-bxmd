import React, { useState } from "react";
import axios from "axios";

const BusCompanyRegistration = () => {
  const apiUrl = import.meta.env.VITE_API;
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    representative: "",
    phoneNumber: "",
    email: "",
    address: "",
    taxCode: "",
    password: "",
    confirmPassword: "",
  });
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    // Clear password error when user is typing
    if (id === "password" || id === "confirmPassword") {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    // Handle form submission logic here
    if (isLogin) {
      try {
        const reponse = await axios.post(`${apiUrl}/login`, {
          email: formData.email,
          password: formData.password,
        });
        setMessage("Đăng nhập thành công!");
        localStorage.setItem("token", reponse.data.access_token);

        // redirect to home page
        window.location.href = "/";
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      try {
        await axios.post(`${apiUrl}/companies/create`, {
          name: formData.companyName,
          representative: formData.representative,
          phone_number: formData.phoneNumber,
          email: formData.email,
          address: formData.address,
          tax_code: formData.taxCode,
          password: formData.password,
        });

        setMessage("Đăng ký công ty thành công!");
        setTimeout(() => {
          setMessage("");
          setErrorMessage("");
          setIsLogin(true);
        }, 2000);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log("Password reset requested for:", formData.email);
    // Password reset logic would go here
    setMessage("Mật khẩu mới đã được gửi đến email của bạn!");
    setTimeout(() => {
      setIsForgotPassword(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-center">
          <div className="flex justify-center items-center mb-2">
            <span className="text-3xl">🚍</span>
          </div>
          <h1 className="text-xl font-bold text-white">Bến Xe Miền Đông</h1>
          <p className="text-blue-100 text-sm">
            {isLogin ? "Đăng nhập tài khoản công ty" : "Đăng ký công ty xe bus"}
          </p>
        </div>

        <div className="p-6">
          {/* Toggle Buttons */}
          <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden">
            <button
              className={`flex-1 cursor-pointer py-3 text-sm font-medium cursor-pointer ${
                isLogin ? "bg-indigo-600 text-white" : "bg-white text-gray-600"
              }`}
              onClick={() => {
                setIsLogin(true);
                setIsForgotPassword(false);
                setMessage("");
                setPasswordError("");
              }}
            >
              Đăng Nhập
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium cursor-pointer ${
                !isLogin ? "bg-indigo-600 text-white" : "bg-white text-gray-600"
              }`}
              onClick={() => {
                setIsLogin(false);
                setIsForgotPassword(false);
                setMessage("");
                setPasswordError("");
              }}
            >
              Đăng Ký
            </button>
          </div>

          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Khôi Phục Mật Khẩu
              </h2>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="company@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 mb-4"
              >
                Gửi Mật Khẩu Mới
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                  onClick={() => setIsForgotPassword(false)}
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </form>
          ) : isLogin ? (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Đăng Nhập Công Ty
              </h2>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="company@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              </div>

              {message && (
                <>
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    {message}{" "}
                  </div>
                  <svg
                    aria-hidden="true"
                    class="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </>
              )}

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full cursor-pointer bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 mb-4"
              >
                Đăng Nhập
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Thông Tin Đăng Ký Công Ty
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên công ty <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập tên công ty"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="representative"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Người đại diện <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="representative"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập tên người đại diện"
                    value={formData.representative}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập số điện thoại"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="company@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Địa chỉ trụ sở <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nhập địa chỉ trụ sở chính"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="taxCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mã số thuế (nếu có)
                </label>
                <input
                  id="taxCode"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nhập mã số thuế"
                  value={formData.taxCode}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tạo mật khẩu (ít nhất 8 ký tự)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {passwordError}
                </div>
              )}

              <div className="flex items-center mb-6">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Tôi đồng ý với{" "}
                  <a
                    href="https://vexemiendong.com.vn/Trang_Quy_Dinh.aspx"
                    className="text-indigo-600 hover:text-indigo-500"
                    _target="blank"
                  >
                    điều khoản và điều kiện
                  </a>{" "}
                  của nền tảng
                </label>
              </div>

              {message && (
                <>
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    {message}{" "}
                  </div>
                  <svg
                    aria-hidden="true"
                    class="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </>
              )}

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full cursor-pointer bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 mb-4"
              >
                Đăng Ký Công Ty
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusCompanyRegistration;
