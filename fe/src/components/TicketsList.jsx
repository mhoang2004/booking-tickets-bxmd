import React from "react";
import { Link } from "react-router-dom";

const TicketsList = ({ ticket }) => {
  return (
    <div
      key={ticket.id}
      className="p-5 border border-indigo-100 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="w-full">
              <div className="flex items-center">
                <span className="text-lg font-bold text-indigo-700">
                  {ticket.from}
                </span>
                <div className="mx-2 flex-1 h-px bg-indigo-200 relative">
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-indigo-400">
                    🚌
                  </span>
                </div>
                <span className="text-lg font-bold text-indigo-700">
                  {ticket.to}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">🚌</span>
                  <span>{ticket.company}</span>
                </div>
                <div className="flex items-center text-sm text-yellow-600">
                  <span className="mr-1">⭐</span>
                  <span>{ticket.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
              <span className="text-xs text-gray-500">Khoảng cách</span>
              <span className="font-medium text-gray-700">
                {ticket.distance} km
              </span>
            </div>
            <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
              <span className="text-xs text-gray-500">Thời gian</span>
              <span className="font-medium text-gray-700">
                ⏳ {ticket.duration} tiếng
              </span>
            </div>
            <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
              <span className="text-xs text-gray-500">Ghế trống</span>
              <span className="font-medium text-gray-700">
                {ticket.seats_available} ghế
              </span>
            </div>
          </div>
        </div>

        <div className="ml-4 flex flex-col items-end">
          <div className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-bold text-lg">
            {ticket.price.toLocaleString()} đ
          </div>
          <p className="text-xs text-gray-500 mt-2">
            📅 {ticket.hour} {ticket.date}
          </p>
          <Link to={`/trips/${ticket.id}`}>
            <button className="mt-2 cursor-pointer text-indigo-600 border border-indigo-600 px-3 py-1 rounded-full text-sm hover:bg-indigo-600 hover:text-white transition-colors duration-300">
              Chọn chuyến
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketsList;
