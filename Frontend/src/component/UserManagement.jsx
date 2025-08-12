import React, { useState } from "react";

const UserManagement = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "descending",
  });

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.studentRef &&
        user.studentRef.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th
                className="cursor-pointer"
                onClick={() => requestSort("name")}
              >
                Name
                {sortConfig.key === "name" && (
                  <span>
                    {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
                  </span>
                )}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => requestSort("email")}
              >
                Email
                {sortConfig.key === "email" && (
                  <span>
                    {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
                  </span>
                )}
              </th>
              <th>Student ID</th>
              <th
                className="cursor-pointer"
                onClick={() => requestSort("role")}
              >
                Role
                {sortConfig.key === "role" && (
                  <span>
                    {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
                  </span>
                )}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => requestSort("createdAt")}
              >
                Joined
                {sortConfig.key === "createdAt" && (
                  <span>
                    {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
                  </span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="flex items-center">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span>{user.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="font-bold">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.studentRef || "-"}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
