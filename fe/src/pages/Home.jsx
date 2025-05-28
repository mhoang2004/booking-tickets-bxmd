import React, { useState, useEffect, useRef } from "react";

import Banner from "../components/Banner";
import BookingForm from "../components/BookingForm";
import PopularBusTickets from "../components/PopularBusTickets";

import CompanyDashboard from "../components/CompanyDashboard";
import AdminDashboard from "../components/AdminDashboard";

import axios from "axios";

const BusTicketBooking = () => {
  const apiUrl = import.meta.env.VITE_API;
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
      
    const token = localStorage.getItem("token");
    if (token) {
      async function getUser() {
        const reponse = await axios.get(`${apiUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(reponse.data);
      }
      getUser();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {user?.role === "company" ? (
        <CompanyDashboard user={user} />
      ) : user?.role === "admin" ? (
        <AdminDashboard user={user} />
      ) : (
        <>
          <Banner />
          <BookingForm />
          <PopularBusTickets />'
        </>
      )}
    </div>
  );
};

export default BusTicketBooking;
