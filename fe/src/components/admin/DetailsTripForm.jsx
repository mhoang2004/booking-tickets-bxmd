import React, { useEffect, useState } from "react";
import axios from "axios";

const DetailsTripForm = ({ tripId, getTrips, toggleSidebar }) => {
  const apiUrl = import.meta.env.VITE_API;
  const [tripDetails, setTripDetails] = useState({});

  async function getTripDetails() {
    const response = await axios.get(`${apiUrl}/trips/${tripId}`);
    setTripDetails(response.data);
  }

  const handleApproveTrip = async () => {
    try {
      await axios.post(`${apiUrl}/active-trip/${tripId}`);
      alert("Duyệt chuyến xe thành công!");
      toggleSidebar();
      getTrips();
    } catch (error) {
      console.error("Error approving trip:", error);
    }
  };

  useEffect(() => {
    getTripDetails();
  }, []);

  return (
    <form className="space-y-4">
      {/* Tỉnh/TP đi và Điểm đi */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tỉnh/TP đi
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={tripDetails.from}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Điểm đi
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={tripDetails.from_point}
            readOnly
          />
        </div>
      </div>

      {/* Tỉnh/TP đến và Điểm trả */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tỉnh/TP đến
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={tripDetails.to}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Điểm trả
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={tripDetails.to_point}
            readOnly
          />
        </div>
      </div>

      {/* Ngày đi và Giờ đi */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày đi
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={tripDetails.date}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giờ đi
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={tripDetails.hour}
            readOnly
          />
        </div>
      </div>

      {/* Xe bus và Giá tiền */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xe bus
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={tripDetails.bus}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá tiền (VNĐ)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={new Intl.NumberFormat("vi-VN").format(tripDetails.price)}
            readOnly
          />
        </div>
      </div>

      {/* Số ghế và Số ghế trống */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số ghế
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={tripDetails.seats}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số ghế trống
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={tripDetails.seats_available}
            readOnly
          />
        </div>
      </div>

      {/* Khoảng cách và Thời gian */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Khoảng cách (km)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={tripDetails.distance}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thời gian (giờ)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={tripDetails.duration}
            readOnly
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        {tripDetails.status === "scheduled" && (
          <button
            type="button"
            className="px-4 cursor-pointer py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleApproveTrip}
          >
            Duyệt
          </button>
        )}

        <button
          type="button"
          onClick={() => toggleSidebar("")}
          className="px-4 cursor-pointer py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Đóng
        </button>
      </div>
    </form>
  );
};

export default DetailsTripForm;
