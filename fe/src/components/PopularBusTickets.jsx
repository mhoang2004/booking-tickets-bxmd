import React, { useEffect, useState } from "react";
import axios from "axios";

import TicketsList from "./TicketsList";

const PopularBusTickets = () => {
  const apiUrl = import.meta.env.VITE_API;

  // State để lưu danh sách vé xe bus và trạng thái tải dữ liệu
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API khi component được render lần đầu
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${apiUrl}/trips`, {
          params: { status: "on_route" },
        });
        setTickets(response.data); // Lưu dữ liệu vé xe vào state
        setLoading(false); // Đánh dấu đã tải xong
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu."); // Nếu có lỗi xảy ra
        setLoading(false); // Đánh dấu đã tải xong
      }
    };

    fetchTickets();
  }, []); // Chỉ chạy khi component được mount

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto pb-5 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
        <span className="text-3xl mr-2">🚍</span>
        <span className="uppercase">Tuyến xe bus phổ biến</span>
      </h2>

      {loading && (
        <div className="max-w-3xl mx-auto flex items-center justify-center h-40">
          <div className="text-center">
            <div className="loader border-t-4 border-indigo-600 rounded-full w-8 h-8 mx-auto animate-spin"></div>
            <p className="mt-3 text-indigo-700 font-medium">
              Đang tải dữ liệu...
            </p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {tickets.map((ticket) => (
          <TicketsList key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default PopularBusTickets;
