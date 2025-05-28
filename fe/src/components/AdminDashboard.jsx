import React, { useState } from "react";
import AdminInfoTab from "./admin/AdminInfoTab";
import CompanyManagementTab from "./admin/CompanyManagementTab";
import UserManagementTab from "./admin/UserManagementTab";
import TripManagementTab from "./admin/TripManagementTab";
import TicketManagementTab from "./admin/TicketManagementTab";

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("Admin Info");
  const tabs = [
    "Admin Info",
    "Company Management",
    "User Management",
    "Trip Management",
    "Ticket Management",
  ];

  // Toggle active tab
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "Admin Info":
        return <AdminInfoTab user={user} />;
      case "Company Management":
        return <CompanyManagementTab />;
      case "User Management":
        return <UserManagementTab />;
      case "Trip Management":
        return <TripManagementTab />;
      case "Ticket Management":
        return <TicketManagementTab />;
      default:
        return <AdminInfoTab />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Quản lý hệ thống</p>
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
                  {tab === "Admin Info" ? "Thông tin" : ""}
                  {tab === "Company Management" ? "Nhà xe" : ""}
                  {tab === "User Management" ? "Người dùng" : ""}
                  {tab === "Trip Management" ? "Chuyến xe" : ""}
                  {tab === "Ticket Management" ? "Vé xe " : ""}
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
              {activeTab === "Admin Info" ? "Thông tin" : ""}
              {activeTab === "Company Management" ? "Nhà xe" : ""}
              {activeTab === "User Management" ? "Người dùng" : ""}
              {activeTab === "Trip Management" ? "Chuyến xe" : ""}
              {activeTab === "Ticket Management" ? "Vé xe" : ""}
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

export default AdminDashboard;
