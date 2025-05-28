import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
const apiUrl = import.meta.env.VITE_API;

// Create Trip Form Component (used in the slide-out sidebar)
const CreateTripForm = ({ user, toggleSidebar, getTrips }) => {
  const [cities, setCities] = useState([]);
  const [buses, setBuses] = useState([]);
  const [departureCity, setDepartureCity] = useState(null); // Tỉnh/TP đi
  const [destinationCity, setDestinationCity] = useState(""); // Tỉnh/TP đến
  const [departurePoint, setDeparturePoint] = useState(null); // Điểm đi đã chọn
  const [destinationPoint, setDestinationPoint] = useState(""); // Điểm trả đã chọn
  const [price, setPrice] = useState("");
  const [selectedBus, setSelectedBus] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getBuses() {
      const response = await axios.get(`${apiUrl}/buses`, {
        params: {
          company_id: user._id,
        },
      });
      setBuses(response.data);
    }

    async function getLocations() {
      const response = await axios.get(`${apiUrl}/locations`);
      setCities(response.data);
    }

    getLocations();
    getBuses();
  }, []);

  const handleDestinationCityChange = (selectedOption) => {
    const city = cities.find((c) => c._id === selectedOption.value);
    setDestinationCity(city);
    setDestinationPoint("");
  };

  const handleDepartureCityChange = (selectedOption) => {
    const city = cities.find((c) => c._id === selectedOption.value);
    setDepartureCity(city);
    setDeparturePoint("");
  };

  const handlePriceChange = (e) => {
    let rawValue = e.target.value.replace(/\D/g, ""); // Chỉ lấy số
    let formatted = new Intl.NumberFormat("vi-VN").format(rawValue);
    setPrice(formatted);
  };

  const validateFields = () => {
    const now = new Date();
    const selectedDate = new Date(departureDate);

    if (
      !departureCity ||
      !departurePoint ||
      !destinationCity ||
      !destinationPoint ||
      !selectedBus ||
      !departureDate ||
      !departureTime ||
      !price
    ) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin!");
      return false;
    }

    if (selectedDate < now.setHours(0, 0, 0, 0)) {
      setErrorMessage("Ngày đi phải lớn hơn hoặc bằng ngày hiện tại!");
      return false;
    }

    if (parseFloat(price.replace(/\D/g, "")) <= 0) {
      setErrorMessage("Giá tiền phải lớn hơn 0!");
      return false;
    }

    setErrorMessage(""); // Clear error message if validation passes
    return true;
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const payload = {
      company_id: user._id,
      from_location: departurePoint,
      to_location: destinationPoint,
      bus_id: selectedBus,
      departure: departureCity._id,
      destination: destinationCity._id,
      date: `${departureDate}T${departureTime}`,
      price: parseFloat(price.replace(/\D/g, "")),
    };

    try {
      await axios.post(`${apiUrl}/trips`, payload);
      setErrorMessage(""); // Clear error message on success
      alert("Tạo chuyến thành công!");
      toggleSidebar(); // đóng form
      getTrips();
    } catch (err) {
      console.error(err);
      setErrorMessage("Có lỗi khi tạo chuyến");
    }
  };

  const getCityOptions = () => {
    return cities.map((city) => ({
      label: city.name,
      value: city._id,
    }));
  };

  return (
    <form className="space-y-4">
      {/* Tỉnh/TP đi */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tỉnh/TP đi
          </label>
          <Select
            options={getCityOptions()}
            value={
              departureCity
                ? { label: departureCity.name, value: departureCity._id }
                : null
            }
            onChange={handleDepartureCityChange}
            placeholder="Chọn tỉnh/TP đi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Điểm đi
          </label>
          <select
            className="w-full p-2 border border-[#ccc] rounded focus:cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20"
            value={departurePoint}
            onChange={(e) => setDeparturePoint(e.target.value)}
            disabled={!departureCity}
          >
            <option disabled value=""></option>
            {departureCity?.points?.map((point) => (
              <option key={point._id} value={point._id}>
                {point.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tỉnh/TP đến
          </label>
          <Select
            options={getCityOptions().filter(
              (city) => city.value !== departureCity?._id
            )}
            value={
              destinationCity
                ? { label: destinationCity.name, value: destinationCity._id }
                : null
            }
            onChange={handleDestinationCityChange}
            placeholder="Chọn tỉnh/TP đến"
            isDisabled={!departurePoint}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Điểm trả
          </label>
          <select
            className="w-full p-2 border border-[#ccc] rounded focus:cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20"
            value={destinationPoint}
            onChange={(e) => setDestinationPoint(e.target.value)}
            disabled={!destinationCity}
          >
            <option disabled value=""></option>
            {destinationCity?.points?.map((point) => (
              <option key={point._id} value={point._id}>
                {point.name}
              </option>
            ))}
          </select>
        </div>
      </div>

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
            className="w-full cursor-pointer p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xe bus
          </label>
          <select
            className="w-full cursor-pointer p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
              inputMode="numeric" // Giúp mobile hiện bàn phím số
            />
          </div>
        </div>
      </div>

      {/* error message will go here */}
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="submit"
          className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={handleCreateTrip}
        >
          Tạo chuyến
        </button>
        <button
          type="button"
          className="px-4 cursor-pointer py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          onClick={toggleSidebar}
        >
          Huỷ
        </button>
      </div>
    </form>
  );
};
export default CreateTripForm;
