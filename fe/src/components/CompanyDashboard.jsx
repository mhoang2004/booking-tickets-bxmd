import React, { useState, useEffect } from "react";
import CompanyInformationTab from "./companies/CompanyInformationTab";
import BusesTab from "./companies/BusesTab";
import TripsTab from "./companies/TripsTab";

const CompanyDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("Company Information");
  const tabs = ["Company Information", "Buses", "Trips"];

  // Toggle active tab
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "Company Information":
        return <CompanyInformationTab user={user} />;
      case "Buses":
        return <BusesTab user={user} />;
      case "Trips":
        return <TripsTab user={user} />;
      default:
        return <CompanyInformationTab />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Nhà xe</h1>
          <p className="text-gray-400 text-sm">Quản lý nhà xe của bạn</p>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <ul>
            {tabs.map((tab) => (
              <li key={tab} className="mb-2">
                <button
                  onClick={() => handleTabClick(tab)}
                  className={`flex cursor-pointer items-center w-full p-3 text-left hover:bg-gray-700 transition-colors ${
                    activeTab === tab
                      ? "bg-gray-700 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  {tab == "Company Information" ? "Thông tin nhà xe" : ""}
                  {tab == "Buses" ? "Xe Bus" : ""}
                  {tab == "Trips" ? "Chuyến xe" : ""}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab == "Company Information" ? "Thông tin nhà xe" : ""}
              {activeTab == "Buses" ? "Xe Bus" : ""}
              {activeTab == "Trips" ? "Chuyến xe" : ""}
            </h2>
          </div>
        </header>

        <main className="p-6">{renderContent()}</main>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
export default CompanyDashboard;
