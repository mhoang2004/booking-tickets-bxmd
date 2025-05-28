  import React, { useState } from "react";

  const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission logic here
      console.log(isLogin ? "Login with:" : "Signup with:", {
        email,
        password,
        name,
      });
    };

    const handleGoogleAuth = () => {
      // Handle Google authentication logic here
      console.log("Authenticating with Google...");
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-center">
            <div className="flex justify-center items-center mb-2">
              <span className="text-3xl">🚍</span>
            </div>
            <h1 className="text-xl font-bold text-white">Bến Xe Miền Đông</h1>
            <p className="text-blue-100 text-sm">
              Đặt vé xe bus trực tuyến dễ dàng
            </p>
          </div>

          <div className="p-6">
            {/* Toggle Buttons */}
            <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden">
              <button
                className={`flex-1 py-3 text-sm font-medium cursor-pointer ${
                  isLogin ? "bg-indigo-600 text-white" : "bg-white text-gray-600"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Đăng Nhập
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium cursor-pointer ${
                  !isLogin ? "bg-indigo-600 text-white" : "bg-white text-gray-600"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Đăng Ký
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Họ và tên
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập họ và tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={
                    isLogin ? "Nhập mật khẩu" : "Tạo mật khẩu (ít nhất 8 ký tự)"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              {!isLogin && (
                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}

              {isLogin && (
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
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white cursor-pointer py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 mb-4"
              >
                {isLogin ? "Đăng Nhập" : "Đăng Ký"}
              </button>

              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-gray-300 flex-grow"></div>
                <span className="mx-3 text-sm text-gray-500">Hoặc</span>
                <div className="border-t border-gray-300 flex-grow"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center cursor-pointer justify-center px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Tiếp tục với Google
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              {isLogin ? (
                <p>
                  Chưa có tài khoản?{" "}
                  <button
                    className="font-medium cursor-pointer text-indigo-600 hover:text-indigo-500"
                    onClick={() => setIsLogin(false)}
                  >
                    Đăng ký ngay
                  </button>
                </p>
              ) : (
                <p>
                  Đã có tài khoản?{" "}
                  <button
                    className="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500"
                    onClick={() => setIsLogin(true)}
                  >
                    Đăng nhập
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default AuthPage;
