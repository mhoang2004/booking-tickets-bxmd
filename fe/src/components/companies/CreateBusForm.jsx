import React, { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API;

const CreateBusForm = ({ user, toggleSidebar, fetchBuses }) => {
  const [name, setName] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [seats, setSeats] = useState("");

  const handleCreateBus = async (e) => {
    e.preventDefault();

    if (!name || !licensePlate || !seats) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const payload = {
      company_id: user._id,
      name,
      license_plate: licensePlate,
      seats: parseInt(seats, 10),
    };

    try {
      await axios.post(`${apiUrl}/buses`, payload);
      alert("Thêm xe thành công!");
      toggleSidebar(); // Close sidebar
      fetchBuses(); // Refresh buses list
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi thêm xe.");
    }
  };

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên xe
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="Nhập tên xe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Biển số
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="Nhập biển số xe"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số ghế
        </label>
        <input
          type="number"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="Nhập số ghế"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="submit"
          className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={handleCreateBus}
        >
          Thêm xe
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

export default CreateBusForm;
