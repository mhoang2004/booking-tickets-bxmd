import React, { useState, useEffect, useRef } from "react";
import { Bus, UserCircle, ChevronDown, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const apiUrl = import.meta.env.VITE_API;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      async function getUser() {
        const reponse = await axios.get(`${apiUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserName(reponse.data.name);
        setRole(reponse.data.role);
        setIsLoggedIn(true);
      }
      getUser();
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setUserName("");
    setRole("");

    window.location.reload();
  };

  return (
    <header className="bg-indigo-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-3">
          <Bus size={32} />
          <h1 className="text-2xl font-bold">Bến Xe Miền Đông</h1>
        </Link>
        <nav className="space-x-4 flex items-center">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex cursor-pointer items-center space-x-2 px-3 py-2 rounded-full transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <UserCircle size={20} className="text-indigo-200" />
                <span className="font-medium">{userName}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 py-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50 transform origin-top-right transition-all duration-200 ease-out">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      logged in as {role}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full cursor-pointer text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center transition-colors duration-150"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/companies/login" className="hover:text-indigo-200">
                Nhà xe
              </Link>
              <Link to="/login" className="hover:text-indigo-200">
                Đăng nhập/ Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
