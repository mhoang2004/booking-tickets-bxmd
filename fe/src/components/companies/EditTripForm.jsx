import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const EditTripForm = ({ tripId, toggleSidebar, getTrips }) => {
  const apiUrl = import.meta.env.VITE_API;
  const [buses, setBuses] = useState([]);
  const [tripDetails, setTripDetails] = useState(null);

  const [price, setPrice] = useState("");
  const [selectedBus, setSelectedBus] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  useEffect(() => {
    async function fetchData() {
      // Fetch trip details
      const tripResponse = await axios.get(`${apiUrl}/trips/${tripId}`);
      const trip = tripResponse.data;
      setTripDetails(trip);

      // Fetch buses
      const busesResponse = await axios.get(`${apiUrl}/buses`, {
        params: { company_id: trip.company_id },
      });
      setBuses(busesResponse.data);

      setPrice(new Intl.NumberFormat("vi-VN").format(trip.price));
      setSelectedBus(trip.bus_id);
      setDepartureDate(trip.date_iso.split("T")[0]); // Extract date
      const timeWithoutMicroseconds = trip.date_iso.split("T")[1].split(".")[0]; // Remove microseconds
      setDepartureTime(timeWithoutMicroseconds);
    }

    fetchData();
  }, [tripId]);

  const handlePriceChange = (e) => {
    let rawValue = e.target.value.replace(/\D/g, ""); // Only numbers
    let formatted = new Intl.NumberFormat("vi-VN").format(rawValue);
    setPrice(formatted);
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();

    if (!selectedBus || !departureDate || !departureTime || !price) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const payload = {
      bus_id: selectedBus,
      date: `${departureDate}T${departureTime}`,
      price: parseFloat(price.replace(/\D/g, "")),
    };

    try {
      await axios.put(`${apiUrl}/trips/${tripId}`, payload);
      alert("Cập nhật chuyến thành công!");
      toggleSidebar();
      getTrips();
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi cập nhật chuyến");
    }
  };

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
            value={tripDetails?.from}
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
            value={tripDetails?.from_point}
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tỉnh/TP đi
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            value={tripDetails?.to}
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
            value={tripDetails?.to_point}
            readOnly
          />
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày đi
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giờ đi
          </label>
          <input
            type="time"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />
        </div>
      </div>

      {/* Bus and Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xe bus
          </label>
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={selectedBus}
            onChange={(e) => setSelectedBus(e.target.value)}
          >
            <option value="" disabled>
              Chọn xe đưa đón
            </option>
            {buses.map((bus) => (
              <option key={bus._id} value={bus._id}>
                {bus.name} ({bus.license_plate})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá tiền (VNĐ)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₫</span>
            </div>
            <input
              type="text"
              className="w-full pl-8 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Nhập giá tiền"
              value={price}
              onChange={handlePriceChange}
              inputMode="numeric"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="submit"
          className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={handleUpdateTrip}
        >
          Cập nhật
        </button>
        <button
          type="button"
          onClick={toggleSidebar}
          className="px-4 cursor-pointer py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Huỷ
        </button>
      </div>
    </form>
  );
};

export default EditTripForm;
