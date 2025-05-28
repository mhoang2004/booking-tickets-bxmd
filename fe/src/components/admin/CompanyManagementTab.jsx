import React, { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API;

const CompanyManagementTab = () => {
  const [companies, setCompanies] = useState([]);

  // Fetch companies from the API
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await axios.get(`${apiUrl}/companies`);
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    }
    fetchCompanies();
  }, []);

  // Toggle active status for a company
  const toggleActiveStatus = async (companyId, isActive) => {
    try {
      await axios.patch(`${apiUrl}/companies/${companyId}`, {
        is_active: !isActive,
      });
      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === companyId
            ? { ...company, is_active: !isActive }
            : company
        )
      );
    } catch (error) {
      console.error("Error updating company status:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Quản lý công ty</h3>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên công ty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người đại diện
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Không có công ty nào
                </td>
              </tr>
            ) : (
              companies.map((company, index) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.phone_number || "(trống)"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.representative || "(trống)"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        company.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {company.is_active ? "Đã kích hoạt" : "Chưa kích hoạt"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        toggleActiveStatus(company.id, company.is_active)
                      }
                      className={`px-2 cursor-pointer py-1 text-sm font-medium rounded ${
                        company.is_active
                          ? "bg-gray-600 text-white hover:bg-gray-500"
                          : "bg-green-600 text-white hover:bg-green-700"
                      } transition-colors`}
                    >
                      {company.is_active ? "Huỷ kích hoạt" : "Kích hoạt"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyManagementTab;
