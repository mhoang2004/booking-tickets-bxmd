import React, { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API;
import { debounce } from "lodash";

import DetailsTripForm from "./DetailsTripForm";
import CreateTripForm from "./CreateTripForm";
import EditTripForm from "./EditTripForm";

// Trips Tab Content (Shows all trips and has button to create new trip)
const TripsTab = ({ user }) => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateTripSidebar, setShowCreateTripSidebar] = useState(false);
  const [showDetailsTripSidebar, setShowDetailsTripSidebar] = useState(false);
  const [showEditTripSidebar, setShowEditTripSidebar] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCreateTripSidebar = () => {
    setShowCreateTripSidebar(!showCreateTripSidebar);
  };

  const toggleDetailsTripSidebar = (trip_id) => {
    setShowDetailsTripSidebar(!showDetailsTripSidebar);
    setSelectedTrip(trip_id);
  };

  const toggleEditTripSidebar = (trip_id) => {
    setShowEditTripSidebar(!showEditTripSidebar);
    setSelectedTrip(trip_id);
  };

  const toggleConfirmDelete = (trip_id) => {
    setShowConfirmDelete(!showConfirmDelete);
    setSelectedTrip(trip_id);
  };

  async function getTrips(search = "") {
    setIsLoading(true);
    const response = await axios.get(`${apiUrl}/trips`, {
      params: {
        company_id: user._id,
        search: search,
      },
    });
    setTrips(response.data);
    setIsLoading(false);
  }

  const handleSearch = debounce((value) => {
    getTrips(value);
  }, 300); // 300ms debounce delay

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value); // Call the debounced function
  };

  useEffect(() => {
    getTrips();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Tất cả các chuyến xe</h3>
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
          <button
            onClick={toggleCreateTripSidebar}
            className="px-4 cursor-pointer py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tạo chuyến mới
          </button>
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
                Phương tiện
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
                <td className="px-4 py-4 whitespace-nowrap">{trip.bus}</td>
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
                    {/* Edit btn */}
                    <button
                      className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors"
                      title="Edit"
                      onClick={() => toggleEditTripSidebar(trip.id)}
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

      {/* Create Trip Slide-out Sidebar */}
      {showCreateTripSidebar && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-20 flex justify-end">
          <div className="h-full bg-white shadow-lg w-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto animate-slide-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Thêm chuyến xe mới
                </h3>
                <button
                  onClick={toggleCreateTripSidebar}
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

              <CreateTripForm
                user={user}
                toggleSidebar={toggleCreateTripSidebar}
                getTrips={getTrips}
              />
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
                toggleSidebar={toggleDetailsTripSidebar}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Trip Slide-out Sidebar */}
      {showEditTripSidebar && selectedTrip && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-20 flex justify-end">
          <div className="h-full bg-white shadow-lg w-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto animate-slide-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Chỉnh sửa chuyến xe
                </h3>
                <button
                  onClick={toggleEditTripSidebar}
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

              <EditTripForm
                tripId={selectedTrip}
                toggleSidebar={toggleEditTripSidebar}
                getTrips={getTrips}
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
export default TripsTab;
