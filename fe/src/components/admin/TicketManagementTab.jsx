import React, { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API;
import { debounce } from "lodash";

const TicketManagementTab = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  async function getBookings(search = "", status = "") {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/bookings`, {
        params: {
          search: search,
          status: status === "all" ? "" : status,
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setIsLoading(false);
  }

  const handleSearch = debounce((value) => {
    getBookings(value, status);
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleStatusClick = (selectedStatus) => {
    setStatus(selectedStatus);
    getBookings(searchTerm, selectedStatus);
  };

  const handleUserClick = (booking) => {
    setSelectedBooking(booking);
    setShowUserDetails(true);
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        {/* Filter by Status */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Tất cả", icon: "filter" },
            { id: "confirmed", label: "Đã xác nhận", icon: "check-circle" },
            { id: "unpaid", label: "Chưa thanh toán", icon: "clock" },
            { id: "cancelled", label: "Đã huỷ", icon: "x-circle" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleStatusClick(filter.id)}
              className={`px-4 cursor-pointer py-2 rounded-full flex items-center transition-all ${
                status === filter.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {/* Add your SVG icons here similar to TripManagementTab */}
              <span className="text-sm font-medium">{filter.label}</span>
            </button>
          ))}
        </div>

        <div className="flex">
          <div className="relative mr-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm vé..."
              className="pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người đặt
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chuyến xe
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số ghế
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhà xe
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings?.map((booking, index) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleUserClick(booking)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {booking.user_fullname || "(trống)"}
                  </button>
                  <div className="text-sm text-gray-500">
                    {booking.user_phone_number}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    {booking.trip_from}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline mx-1 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                    {booking.trip_to}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {booking.seat_number.join(", ")}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {booking.company_name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "unpaid"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status === "confirmed"
                      ? "Đã xác nhận"
                      : booking.status === "unpaid"
                      ? "Chưa thanh toán"
                      : "Đã huỷ"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        // Handle edit action
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isLoading && (
          <div className="p-3">
            Đang tải
            <span className="inline-flex ml-1">
              <span className="animate-bounce mx-px delay-75">.</span>
              <span className="animate-bounce mx-px delay-150">.</span>
              <span className="animate-bounce mx-px delay-300">.</span>
            </span>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-30 flex justify-center items-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-gray-800">
                Chi tiết người đặt vé
              </h3>
              <button
                onClick={() => setShowUserDetails(false)}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Họ và tên
                </label>
                <p className="text-gray-900 font-semibold">
                  {selectedBooking.user_fullname}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{selectedBooking.user_email}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Số điện thoại
                </label>
                <p className="text-gray-900">
                  {selectedBooking.user_phone_number}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowUserDetails(false)}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManagementTab;
