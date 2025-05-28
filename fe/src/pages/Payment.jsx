import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import momoQR from "/public/momo.jpg"; // Import the QR code image

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API;

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get trip, selected seats, and passenger info from router state
  const { trip, selectedSeats, passengerInfo } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);

    // If no trip data is available, redirect back to trips page
    if (!trip || !selectedSeats || !passengerInfo) {
      navigate("/trips");
    }
  }, [trip, selectedSeats, passengerInfo, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo({
      ...cardInfo,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // // Validate card number (16 digits)
    // if (!/^\d{16}$/.test(cardInfo.cardNumber.replace(/\s/g, ""))) {
    //   newErrors.cardNumber = "Số thẻ phải có 16 chữ số";
    // }

    // // Validate card name
    // if (!cardInfo.cardName.trim()) {
    //   newErrors.cardName = "Vui lòng nhập tên trên thẻ";
    // }

    // // Validate expiry date (MM/YY format)
    // if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardInfo.expiryDate)) {
    //   newErrors.expiryDate = "Định dạng hợp lệ: MM/YY";
    // }

    // // Validate CVV (3-4 digits)
    // if (!/^\d{3,4}$/.test(cardInfo.cvv)) {
    //   newErrors.cvv = "CVV phải có 3-4 chữ số";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await axios.post(`${apiUrl}/bookings`, {
        trip_id: trip.id,
        seat_number: selectedSeats,
        user_fullname: passengerInfo.name,
        user_email: passengerInfo.email,
        user_phone_number: passengerInfo.phone,
        company_id: trip.company_id,
      });

      setIsSuccess(true);

      const subject = `Xác nhận thanh toán thành công - Vé xe từ ${trip.from} đến ${trip.to}`;
      const body = `
        <h1>Xin chào ${passengerInfo.name},</h1>
        <p>Chúng tôi xin xác nhận rằng bạn đã thanh toán thành công cho chuyến xe của mình.</p>
        <h2>Thông tin chi tiết:</h2>
        <ul>
          <li><strong>Chuyến xe:</strong> ${trip.from} → ${trip.to}</li>
          <li><strong>Thời gian:</strong> ${trip.hour} - ${trip.date}</li>
          <li><strong>Ghế đã chọn:</strong> ${selectedSeats.join(", ")}</li>
          <li><strong>Tổng tiền:</strong> ${totalAmount.toLocaleString()} đ</li>
        </ul>
        <p>Vui lòng mang theo email này khi lên xe để đối chiếu thông tin.</p>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        <p>Trân trọng,</p>
        <p>Đội ngũ hỗ trợ có thể sẽ hỏi số điện thoại của bạn, hãy chắc rằng bạn nhớ nó!</p>
        `;
      await axios.post(`${apiUrl}/send-email`, {
        to: passengerInfo.email,
        subject: subject,
        body: body,
      });

      // Redirect to success page after 2 seconds
      alert(
        "Thanh toán thành công! Vui lòng kiểm tra email để xem thông tin vé"
      );

      navigate("/");
    } catch (error) {
      setErrors({
        submit: "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.",
      });
      setIsProcessing(false);
    }
  };

  const totalAmount = trip ? trip.price * selectedSeats.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-indigo-600">Đang tải dữ liệu thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg my-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 cursor-pointer bg-white hover:bg-gray-100 text-indigo-700 py-2 px-4 rounded-lg shadow flex items-center"
        disabled={isProcessing}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Quay lại
      </button>

      <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
        Thanh toán vé xe
      </h2>

      {isSuccess ? (
        <div className="p-6 border border-green-100 rounded-lg shadow-md bg-green-50 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">
            Thanh toán thành công!
          </h3>
          <p className="text-green-700">Đang gửi mail...</p>
          <div className="mt-4 animate-pulse rounded-full h-2 w-32 bg-green-300 mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Order summary */}
          <div className="p-6 border border-indigo-100 rounded-lg shadow-md bg-white mb-6">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">
              Chi tiết đơn hàng
            </h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Chuyến xe:</span>
                <span className="font-medium text-gray-800">
                  {trip ? `${trip.from} → ${trip.to}` : ""}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium text-gray-800">
                  {trip ? `${trip.hour} - ${trip.date}` : ""}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Ghế đã chọn:</span>
                <span className="font-medium text-gray-800">
                  {selectedSeats ? selectedSeats.join(", ") : ""}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Hành khách:</span>
                <span className="font-medium text-gray-800">
                  {passengerInfo ? passengerInfo.name : ""}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Liên hệ:</span>
                <span className="font-medium text-gray-800">
                  {passengerInfo ? passengerInfo.phone : ""}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-bold text-gray-800">
                  Tổng tiền:
                </span>
                <span className="text-xl font-bold text-indigo-700">
                  {totalAmount.toLocaleString()} đ
                </span>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div className="p-6 border border-indigo-100 rounded-lg shadow-md bg-white mb-6">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">
              Phương thức thanh toán
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                  paymentMethod === "card"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-200"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="font-medium">Thẻ tín dụng/Ghi nợ</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("banking")}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                  paymentMethod === "banking"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-200"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                  />
                </svg>
                <span className="font-medium">Internet Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("momo")}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                  paymentMethod === "momo"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-200"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">Ví MoMo</span>
              </button>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === "card" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Số thẻ
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardInfo.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="p-3 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cardName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên trên thẻ
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={cardInfo.cardName}
                    onChange={handleInputChange}
                    placeholder="NGUYEN VAN A"
                    className="p-3 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {errors.cardName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cardName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="expiryDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ngày hết hạn (MM/YY)
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={cardInfo.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="p-3 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      CVV
                    </label>
                    <input
                      type="password"
                      id="cvv"
                      name="cvv"
                      value={cardInfo.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="p-3 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-red-600">{errors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full cursor-pointer py-3 px-4 rounded-lg font-bold text-white text-lg shadow-md transition-all ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    `Thanh toán ${totalAmount.toLocaleString()} đ`
                  )}
                </button>
              </form>
            )}

            {/* Internet Banking Form */}
            {paymentMethod === "banking" && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-bold text-blue-800 mb-2">
                    Hướng dẫn thanh toán qua Internet Banking
                  </h4>
                  <ol className="list-decimal pl-5 text-blue-700 space-y-2">
                    <li>
                      Sau khi bấm "Tiếp tục", bạn sẽ được chuyển đến trang thanh
                      toán của ngân hàng
                    </li>
                    <li>Đăng nhập vào tài khoản ngân hàng của bạn</li>
                    <li>Xác nhận thông tin thanh toán</li>
                    <li>Hoàn tất giao dịch và quay lại trang web</li>
                  </ol>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-3 flex items-center justify-center bg-white hover:bg-gray-50 cursor-pointer">
                    <span className="font-medium text-gray-700">
                      Vietcombank
                    </span>
                  </div>
                  <div className="border rounded-lg p-3 flex items-center justify-center bg-white hover:bg-gray-50 cursor-pointer">
                    <span className="font-medium text-gray-700">BIDV</span>
                  </div>
                  <div className="border rounded-lg p-3 flex items-center justify-center bg-white hover:bg-gray-50 cursor-pointer">
                    <span className="font-medium text-gray-700">Agribank</span>
                  </div>
                  <div className="border rounded-lg p-3 flex items-center justify-center bg-white hover:bg-gray-50 cursor-pointer">
                    <span className="font-medium text-gray-700">
                      Techcombank
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className={`w-full cursor-pointer py-3 px-4 rounded-lg font-bold text-white text-lg shadow-md transition-all ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    "Tiếp tục"
                  )}
                </button>
              </div>
            )}

            {/* MoMo Form */}
            {paymentMethod === "momo" && (
              <div className="space-y-4">
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                  <h4 className="font-bold text-pink-800 mb-2">
                    Hướng dẫn thanh toán qua ví MoMo
                  </h4>
                  <ol className="list-decimal pl-5 text-pink-700 space-y-2">
                    <li>Quét mã QR bên dưới bằng ứng dụng MoMo</li>
                    <li>Xác nhận thông tin thanh toán trên ứng dụng</li>
                    <li>Hoàn tất giao dịch</li>
                    <li>Nhấn "Xác nhận đã thanh toán" sau khi hoàn tất</li>
                  </ol>
                </div>

                <div className="flex justify-center p-6">
                  <div className="border-4 border-pink-300 rounded-lg p-2 w-48 h-48 flex items-center justify-center bg-white">
                    <img
                      src={momoQR}
                      alt="Mã QR MoMo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className={`w-full cursor-pointer py-3 px-4 rounded-lg font-bold text-white text-lg shadow-md transition-all ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    "Xác nhận đã thanh toán"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-sm text-gray-600">
              Thông tin thanh toán của bạn được bảo mật và mã hóa an toàn. Chúng
              tôi không lưu trữ thông tin thẻ của bạn.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Payment;
