import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API;

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState(new Set());
  const [passengerInfo, setPassengerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTripDetails = async () => {
      try {
        const tripsResponse = await axios.get(`${apiUrl}/trips/${id}`);
        setTrip(tripsResponse.data);

        const seatsOccupiedResponse = await axios.get(
          `${apiUrl}/trips/${id}/seats`
        );
        // Convert the array to a Set for faster lookups
        setOccupiedSeats(new Set(seatsOccupiedResponse.data));
        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu chuyến đi.");
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      async function getUser() {
        const response = await axios.get(`${apiUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);

        setPassengerInfo({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone_number || "",
        });
      }
      getUser();
    }

    fetchTripDetails();
  }, [id, apiUrl]);

  const handleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      if (selectedSeats.length < 5) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        alert("Bạn chỉ có thể chọn tối đa 5 ghế.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassengerInfo({
      ...passengerInfo,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate name
    if (!passengerInfo.name.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên.");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(passengerInfo.email)) {
      setErrorMessage("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(passengerInfo.phone)) {
      setErrorMessage("Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số).");
      return;
    }

    if (selectedSeats.length === 0) {
      setErrorMessage("Vui lòng chọn ít nhất một ghế.");
      return;
    }

    setErrorMessage(null); // Clear error message if validation passes
    navigate("/payment", { state: { trip, selectedSeats, passengerInfo } });
  };

  // Generate bus seats layout
  const renderSeats = () => {
    if (!trip) return null;

    const totalSeats = trip.seats;
    const seatsPerRow = 4; // 2 seats on each side with an aisle in the middle
    const rows = Math.ceil(totalSeats / seatsPerRow);

    let seatElements = [];

    for (let row = 0; row < rows; row++) {
      const rowSeats = [];

      for (let col = 0; col < seatsPerRow; col++) {
        const seatNumber = row * seatsPerRow + col + 1;

        if (seatNumber <= totalSeats) {
          const isOccupied = occupiedSeats.has(seatNumber);
          const isSelected = selectedSeats.includes(seatNumber);

          let seatClass =
            "flex items-center justify-center w-10 h-10 m-1 rounded-md ";

          if (isSelected) {
            seatClass += "bg-indigo-600 text-white cursor-pointer";
          } else if (isOccupied) {
            seatClass += "bg-gray-300 text-gray-500 cursor-not-allowed";
          } else {
            seatClass +=
              "bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-100 cursor-pointer";
          }

          rowSeats.push(
            <div
              key={seatNumber}
              className={seatClass}
              onClick={() => !isOccupied && handleSeatSelection(seatNumber)}
            >
              {seatNumber}
            </div>
          );
        } else {
          // Add empty space for alignment if we're at the end
          rowSeats.push(
            <div key={`empty-${row}-${col}`} className="w-10 h-10 m-1" />
          );
        }

        // Add aisle after the 2nd seat (middle of the bus)
        if (col === 1) {
          rowSeats.push(<div key={`aisle-${row}`} className="w-6 h-10 m-1" />);
        }
      }

      seatElements.push(
        <div key={`row-${row}`} className="flex justify-center">
          {rowSeats}
        </div>
      );
    }

    return seatElements;
  };

  if (loading) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-indigo-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto p-6 text-center">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 cursor-pointer bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto p-6 text-center">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-700">Không tìm thấy thông tin chuyến đi.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 cursor-pointer bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-2 px-4 rounded"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Calculate available seats by subtracting occupied seats from total
  const availableSeats = trip.seats - occupiedSeats.size;

  return (
    <div className="max-w-4xl mx-auto pb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg my-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 cursor-pointer bg-white hover:bg-gray-100 text-indigo-700 py-2 px-4 rounded-lg shadow flex items-center"
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
        Chi tiết chuyến đi
      </h2>

      {/* Trip information */}
      <div className="p-6 border border-indigo-100 rounded-lg shadow-md bg-white mb-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-indigo-100">
          <div>
            <h3 className="text-xl font-bold text-indigo-800 mb-1">
              {trip.from} → {trip.to}
            </h3>
            <p className="text-indigo-600 font-medium">{trip.company}</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-bold text-xl shadow-md">
            {trip.price.toLocaleString()} đ
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm transition-all hover:shadow-md">
            <span className="text-blue-500 mb-1">Khoảng cách</span>
            <span className="font-bold text-lg text-blue-800">
              {trip.distance} km
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg shadow-sm transition-all hover:shadow-md">
            <span className="text-purple-500 mb-1">Thời gian</span>
            <span className="font-bold text-lg text-purple-800">
              {trip.duration} tiếng
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg shadow-sm transition-all hover:shadow-md">
            <span className="text-green-500 mb-1">Ghế trống</span>
            <span className="font-bold text-lg text-green-800">
              {availableSeats} ghế
            </span>
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-indigo-700 font-medium">
              Ngày khởi hành: <span className="font-bold">{trip.date}</span>
            </p>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-600 mr-2"
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
            <p className="text-indigo-700 font-medium">
              Giờ xuất phát: <span className="font-bold">{trip.hour}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Seat selection */}
      <div className="p-6 border border-indigo-100 rounded-lg shadow-md bg-white mb-6">
        <h3 className="text-xl font-bold text-indigo-800 mb-4">Chọn ghế</h3>

        <div className="mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border border-indigo-300 mr-2"></div>
              <span className="text-sm text-gray-600">Còn trống</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-indigo-600 mr-2"></div>
              <span className="text-sm text-gray-600">Đang chọn</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 mr-2"></div>
              <span className="text-sm text-gray-600">Đã bán</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Bạn đã chọn {selectedSeats.length} ghế:{" "}
            {selectedSeats.length > 0
              ? selectedSeats.join(", ")
              : "Chưa chọn ghế nào"}
          </p>

          <div className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50">
            {/* Bus layout */}
            <div className="mb-6 p-2 bg-gray-200 rounded text-center text-gray-700 font-medium">
              PHÍA TRƯỚC XE
            </div>

            {/* Seats arranged in rows with an aisle */}
            <div className="mb-6">{renderSeats()}</div>

            <div className="p-2 bg-gray-200 rounded text-center text-gray-700 font-medium">
              PHÍA SAU XE
            </div>
          </div>
        </div>
      </div>

      {/* Passenger information */}
      <div className="p-6 border border-indigo-100 rounded-lg shadow-md bg-white mb-6">
        <h3 className="text-xl font-bold text-indigo-800 mb-4">
          Thông tin hành khách
        </h3>

        <form className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={passengerInfo.name}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên của bạn"
              className="p-3 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={passengerInfo.email}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ email của bạn"
              className="p-3 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={passengerInfo.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại của bạn"
              className="p-3 w-full border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </form>

        {errorMessage && (
          <div className="my-2 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Payment summary */}
      <div className="p-6 border border-indigo-100 rounded-lg shadow-md bg-white">
        <h3 className="text-xl font-bold text-indigo-800 mb-4">
          Hóa đơn thanh toán
        </h3>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Điểm đón:</span>
            <span className="font-medium text-gray-800">{trip.from_point}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Điểm trả:</span>
            <span className="font-medium text-gray-800">{trip.to_point}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Thời gian xuất bến:</span>
            <span className="font-medium text-gray-800">
              {trip.hour} - {trip.date}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Số ghế đã chọn:</span>
            <span className="font-medium text-gray-800">
              {selectedSeats.length} ghế{" "}
              {selectedSeats.length > 0 ? `(${selectedSeats.join(", ")})` : ""}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Giá vé:</span>
            <span className="font-medium text-gray-800">
              {trip.price.toLocaleString()} đ / ghế
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-lg font-bold text-gray-800">Tổng tiền:</span>
            <span className="text-xl font-bold text-indigo-700">
              {(trip.price * selectedSeats.length).toLocaleString()} đ
            </span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full cursor-pointer py-3 px-4 rounded-lg font-bold text-white text-lg shadow-md transition-all ${
            selectedSeats.length > 0
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={selectedSeats.length === 0}
        >
          {selectedSeats.length > 0
            ? `Thanh toán (${selectedSeats.length} ghế)`
            : "Vui lòng chọn ghế"}
        </button>
      </div>

      <div className="p-6 border border-indigo-100 rounded-lg shadow-md bg-white mt-4">
        (*) Quý khách vui lòng có mặt tại Bến xe/Văn Phòng{" "}
        <span className="font-bold">{trip.from_point}</span> trước{" "}
        <span className="font-bold underline">
          {trip.hour} {trip.date}
        </span>{" "}
        để kiểm tra thông tin trước khi lên xe.
      </div>
    </div>
  );
};

export default TripDetails;
