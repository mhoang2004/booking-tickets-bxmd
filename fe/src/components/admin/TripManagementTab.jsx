import React, { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API;
import { debounce } from "lodash";

import DetailsTripForm from "./DetailsTripForm";

// Trips Tab Content (Shows all trips and has button to create new trip)
const TripManagementTab = ({ user }) => {
  const [trips, setTrips] = useState([]);
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailsTripSidebar, setShowDetailsTripSidebar] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");

  const toggleDetailsTripSidebar = (trip_id) => {
    setShowDetailsTripSidebar(!showDetailsTripSidebar);
    setSelectedTrip(trip_id);
  };

  const toggleConfirmDelete = (trip_id) => {
    setShowConfirmDelete(!showConfirmDelete);
    setSelectedTrip(trip_id);
  };

  async function getCompany(company_id) {
    const response = await axios.get(`${apiUrl}/companies/${company_id}`);
    setCompany(response.data);
  }

  async function getTrips(search = "", status = "") {
    setIsLoading(true);
    const response = await axios.get(`${apiUrl}/trips`, {
      params: {
        search: search,
        status: status === "all" ? "" : status,
      },
    });
    setTrips(response.data);
    setIsLoading(false);
  }

  const handleCompanyClick = (company_id) => {
    getCompany(company_id); // Fetch the company details
    setShowCompany(true);
  };

  const handleSearch = debounce((value) => {
    getTrips(value);
  }, 300); // 300ms debounce delay

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value); // Call the debounced function
  };

  // Handle status filter click
  const handleStatusClick = (selectedStatus) => {
    setStatus(selectedStatus); // Update the selected status
    getTrips(searchTerm, selectedStatus); // Fetch trips with the selected status
  };

  useEffect(() => {
    getTrips();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        {/* Filter by Status */}
        {/* Filter by Status */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "Tất cả", icon: "filter" },
            { id: "scheduled", label: "Chờ duyệt", icon: "clock" },
            { id: "on_route", label: "Đã duyệt", icon: "check-circle" },
            { id: "completed", label: "Hoàn thành", icon: "flag" },
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
              {filter.icon === "filter" && (
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              )}
              {filter.icon === "clock" && (
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {filter.icon === "check-circle" && (
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {filter.icon === "flag" && (
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
                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                  />
                </svg>
              )}
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
              placeholder="Tìm chuyến xe..."
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
                Chuyến xe
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Công ty
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chỗ ngồi
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
            {trips?.length === 0 && !isLoading && (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Không tìm thấy chuyến xe
                </td>
              </tr>
            )}
            {trips?.map((trip, index) => (
              <tr key={trip.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap font-medium">
                  {index + 1}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {trip.from_point}
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
                  {trip.to_point}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm">{trip.date}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {trip.hour}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleCompanyClick(trip.company_id)}
                    className="text-blue-600 cursor-pointer hover:text-blue-800 underline transition-colors"
                  >
                    {trip.company}
                  </button>
                </td>
                <td className="px-4 py-4 whitespace-nowrap font-medium">
                  {trip.price.toLocaleString("vi-VN")} ₫
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {trip.status === "sold_out" ? (
                    <span className="text-red-500 font-medium">0</span>
                  ) : (
                    <span className="font-medium">{trip.seats_available}</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      trip.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : trip.status === "on_route"
                        ? "bg-yellow-100 text-yellow-800"
                        : trip.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : trip.status === "sold_out"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {trip.status === "scheduled"
                      ? "Chờ duyệt"
                      : trip.status === "on_route"
                      ? "Đã duyệt"
                      : trip.status === "completed"
                      ? "Hoàn thành"
                      : trip.status === "sold_out"
                      ? "Hết vé"
                      : "Lỗi"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    {/* Details btn */}
                    <button
                      onClick={() => toggleDetailsTripSidebar(trip.id)}
                      className="text-green-600 cursor-pointer hover:text-green-900 transition-colors"
                      title="Tickets"
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
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                        />
                      </svg>
                    </button>

                    {/* Delete btn */}
                    <button
                      className="text-red-600 cursor-pointer hover:text-red-900 transition-colors"
                      title="Cancel"
                      onClick={() => toggleConfirmDelete(trip.id)}
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
                          d="M6 18L18 6M6 6l12 12"
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
              <span
                className="animate-bounce mx-px delay-150"
                style={{ animationDelay: "0.2s" }}
              >
                .
              </span>
              <span
                className="animate-bounce mx-px delay-300"
                style={{ animationDelay: "0.4s" }}
              >
                .
              </span>
            </span>
          </div>
        )}
      </div>

      {/* View Company Information Modal */}
      {showCompany && company && (
        <div className="fixed inset-0 bg-black/60 z-30 flex justify-center items-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-gray-800">
                Chi tiết công ty
              </h3>
              <button
                onClick={() => setShowCompany(false)}
                className="text-gray-500 cursor-pointer hover:text-gray-800 transition-colors"
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

            <div className="space-y-5 divide-y divide-gray-100">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Tên công ty
                  </label>
                  <p className="text-gray-900 font-semibold">{company.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Người đại diện
                    </label>
                    <p className="text-gray-900">{company.representative}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Mã số thuế
                    </label>
                    <p className="text-gray-900">{company.tax_code}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <h4 className="font-medium text-gray-800">Thông tin liên hệ</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">
                        Số điện thoại
                      </label>
                      <p className="text-gray-900">{company.phone_number}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">
                        Email
                      </label>
                      <p className="text-gray-900">{company.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">
                        Địa chỉ
                      </label>
                      <p className="text-gray-900">{company.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowCompany(false)}
                className="px-5 cursor-pointer py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Detail Trip Slide-out Sidebar */}
      {showDetailsTripSidebar && selectedTrip && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-20 flex justify-end">
          <div className="h-full bg-white shadow-lg w-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto animate-slide-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Xem chi tiết chuyến xe
                </h3>
                <button
                  onClick={toggleDetailsTripSidebar}
                  className="p-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
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

              <DetailsTripForm
                tripId={selectedTrip}
                getTrips={getTrips}
                toggleSidebar={toggleDetailsTripSidebar}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Trip Confirmation Modal */}
      {showConfirmDelete && selectedTrip && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-30 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Xác nhận xoá chuyến xe
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn xoá chuyến xe này? Hành động này không thể
              hoàn tác.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 cursor-pointer py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={async () => {
                  try {
                    await axios.delete(`${apiUrl}/trips/${selectedTrip}`);
                    alert("Xoá chuyến xe thành công!");
                    setShowConfirmDelete(false);
                    getTrips(); // Refresh the trips list
                  } catch (err) {
                    console.error(err);
                    alert("Có lỗi xảy ra khi xoá chuyến xe.");
                  }
                }}
                className="px-4 cursor-pointer py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-between float-end items-center">
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button className="relative cursor-pointer inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100">
              1
            </button>
            <button className="relative cursor-pointer inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
export default TripManagementTab;
