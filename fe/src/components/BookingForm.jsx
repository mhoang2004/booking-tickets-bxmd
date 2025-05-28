import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const BookingForm = ({ defaultData }) => {
  const apiUrl = import.meta.env.VITE_API;
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState(
    defaultData || {
      from: "",
      to: "",
      date: "",
      returnDate: "",
      passengers: 1,
      tripType: "oneWay",
    }
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch cities from the API
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${apiUrl}/locations`);
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const now = new Date();
    const selectedDate = new Date(formData.date);
    const selectedReturnDate = new Date(formData.returnDate);

    if (!formData.from || !formData.to || !formData.date) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return false;
    }

    if (selectedDate < now) {
      setErrorMessage("Ngày đi phải lớn hơn hoặc bằng ngày hiện tại.");
      return false;
    }

    if (formData.passengers < 1) {
      setErrorMessage("Số vé phải lớn hơn hoặc bằng 1.");
      return false;
    }

    if (
      formData.tripType === "roundTrip" &&
      selectedReturnDate < selectedDate
    ) {
      setErrorMessage("Ngày về phải lớn hơn hoặc bằng ngày đi.");
      return false;
    }

    setErrorMessage(""); // Clear error message if validation passes
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    navigate("/search-results", { state: formData });
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Tìm chuyến xe</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Type Selection */}
          <div className="flex space-x-4 mb-6">
            {["oneWay", "roundTrip"].map((type) => (
              <label
                key={type}
                className={`inline-flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-all 
                ${
                  formData.tripType === type
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
            `}
              >
                <input
                  type="radio"
                  name="tripType"
                  value={type}
                  checked={formData.tripType === type}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="text-sm">
                  {type === "oneWay" ? "Một chiều" : "Khứ hồi"}
                </span>
              </label>
            ))}
          </div>

          {/* Inline Form Fields */}
          <div className="flex flex-wrap items-end gap-4 sm:space-y-4 md:space-y-0">
            <div className="flex-1 min-w-[200px] w-full">
              <label
                htmlFor="from"
                className="block text-sm font-medium text-gray-700"
              >
                Điểm đi
              </label>
              <select
                name="from"
                value={formData.from}
                onChange={handleChange}
                required
                className="mt-1 cursor-pointer block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Chọn điểm đi</option>
                {cities.map((city) => (
                  <option key={city.id || city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px] w-full">
              <label
                htmlFor="to"
                className="block text-sm font-medium text-gray-700"
              >
                Điểm đến
              </label>
              <select
                name="to"
                value={formData.to}
                onChange={handleChange}
                required
                className="mt-1 cursor-pointer block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Chọn điểm đến</option>
                {cities
                  .filter((city) => city.name !== formData.from)
                  .map((city) => (
                    <option key={city.id || city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px] w-full">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Ngày đi
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 cursor-pointer block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {formData.tripType === "roundTrip" && (
              <div className="flex-1 min-w-[150px] w-full">
                <label
                  htmlFor="returnDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ngày về
                </label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  required
                  className="mt-1 cursor-pointer block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            <div className="flex-1 min-w-[100px] w-full">
              <label
                htmlFor="passengers"
                className="block text-sm font-medium text-gray-700"
              >
                Số vé
              </label>
              <input
                type="number"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                min="1"
                max="10"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Display error message */}
            {errorMessage && (
              <div className="text-red-500 text-sm text-center">
                {errorMessage}
              </div>
            )}

            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="bg-indigo-600 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Tìm chuyến xe
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
