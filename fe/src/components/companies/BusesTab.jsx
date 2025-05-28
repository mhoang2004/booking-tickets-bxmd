import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateBusForm from "./CreateBusForm"; // Import CreateBusForm
const apiUrl = import.meta.env.VITE_API;

// Buses Tab Content
const BusesTab = ({ user }) => {
  const [buses, setBuses] = useState([]);
  const [showCreateBusSidebar, setShowCreateBusSidebar] = useState(false); // State for sidebar

  const toggleCreateBusSidebar = () => {
    setShowCreateBusSidebar(!showCreateBusSidebar);
  };

  async function fetchBuses() {
    const response = await axios.get(`${apiUrl}/buses`, {
      params: {
        company_id: user._id,
      },
    });
    setBuses(response.data);
  }

  useEffect(() => {
    fetchBuses();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Quản lý xe</h3>
        <button
          onClick={toggleCreateBusSidebar} // Open sidebar
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
          Thêm xe mới
        </button>
      </div>

      {/* Sidebar for creating a new bus */}
      {showCreateBusSidebar && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-20 flex justify-end">
          <div className="h-full bg-white shadow-lg w-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto animate-slide-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Thêm xe mới
                </h3>
                <button
                  onClick={toggleCreateBusSidebar} // Close sidebar
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

              <CreateBusForm
                user={user}
                toggleSidebar={toggleCreateBusSidebar}
                fetchBuses={fetchBuses} // Refresh buses list
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên xe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Biển số
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số ghế
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {buses?.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Không tìm thấy xe
                </td>
              </tr>
            )}

            {buses.map((bus, index) => (
              <tr key={bus.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bus.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {bus.license_plate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{bus.seats}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      bus.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {bus.status === "active" ? "ĐANG HOẠT ĐỘNG" : "TẠM DỪNG"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-900 mr-3 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 inline"
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
                    Sửa
                  </button>
                  <button className="text-red-600 hover:text-red-900 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 inline"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default BusesTab;
