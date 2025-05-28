import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import TicketsList from "../components/TicketsList";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const formData = location.state;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const params = {
          from_location: formData.from,
          to_location: formData.to,
          date: formData.date,
          return_date: formData.returnDate,
          passengers: formData.passengers,
        };
        const response = await axios.post(
          `${import.meta.env.VITE_API}/trips/search`,
          params
        );
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (formData) {
      fetchTickets();
    }
  }, [formData]);

  return (
    <div className="pb-5 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg">
      <BookingForm defaultData={formData} />

      <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
        <span className="text-3xl mr-2">🚍</span>
        <span className="uppercase">
          chuyến: {formData?.from} → {formData?.to}
        </span>
      </h2>
      <div className="max-w-3xl mx-auto pb-5 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg">
        <div className="space-y-5">
          {loading ? ( // Show loading message if loading
            <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
          ) : tickets.length > 0 ? (
            tickets.map((ticket) => (
              <TicketsList key={ticket.id} ticket={ticket} />
            ))
          ) : (
            <p className="text-center text-gray-500">Không có kết quả nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
