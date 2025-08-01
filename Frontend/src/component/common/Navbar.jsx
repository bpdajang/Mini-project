import React, { useState, useEffect } from "react";
import { useAuth } from "../../component/context/authContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isDashboardPage, setIsDashboardPage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsDashboardPage(
      location.pathname === "/dashboard" || location.pathname === "/admin"
    );
  }, [location]);

  // Determine dashboard path based on user role
  const dashboardPath = currentUser
    ? currentUser.role === "admin"
      ? "/admin"
      : "/dashboard"
    : "/";

  return (
    <div className="container sticky top-0 z-50 mr-0 ml-0 bg-base-100 w-screen">
      <div className="navbar">
        <div className="navbar-start">
          {/* Conditionally render dropdown only when not on dashboard page */}
          {!isDashboardPage && (
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost md:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/#about">About</Link>
                </li>
                <li>
                  <Link to="/advice">Resources</Link>
                </li>
                <li>
                  <Link to="/dashboard">Messages</Link>
                </li>
              </ul>
            </div>
          )}

          <div className="logo mt-0 w-52 flex items-center space-x-4">
            <Link
              to={dashboardPath}
              className="btn btn-ghost text-xl inline-block h-14 hover:bg-red-300 flex items-center justify-center"
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rounded-full"
              >
                <circle
                  cx="28"
                  cy="28"
                  r="26"
                  stroke="url(#halfGradient)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <defs>
                  <linearGradient
                    id="halfGradient"
                    x1="0"
                    y1="0"
                    x2="56"
                    y2="0"
                  >
                    <stop offset="50%" stopColor="red" />
                    <stop offset="50%" stopColor="gray" />
                  </linearGradient>
                </defs>
                <text
                  x="10"
                  y="36"
                  fill="red"
                  fontSize="24"
                  fontWeight="bold"
                  fontFamily="Arial, sans-serif"
                >
                  H
                </text>
                <text
                  x="27"
                  y="36"
                  fill="#6B7280"
                  fontSize="24"
                  fontWeight="bold"
                  fontFamily="Arial, sans-serif"
                >
                  M
                </text>
              </svg>
            </Link>
            {currentUser && !isDashboardPage && (
              <Link
                to={dashboardPath}
                className="text-xl font-semibold text-gray-700 hover:text-red-600 ml-4 self-center"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Hide navbar center links on dashboard pages */}
        {!isDashboardPage && (
          <div className="navbar-center hidden md:flex">
            <ul className="menu menu-horizontal space-x-2 mr-20 lg:space-x-10 px-1">
              <li>
                <Link
                  to="/"
                  className="btn-ghost inline-block hover:bg-red-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#about"
                  className="btn-ghost inline-block hover:bg-red-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/advice"
                  className="btn-ghost inline-block hover:bg-red-300"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="btn-ghost inline-block hover:bg-red-300"
                >
                  Messages
                </Link>
              </li>
            </ul>
          </div>
        )}

        <div className="navbar-end right-8 flex items-center">
          {/* Add this section for Login/Register */}
          {!currentUser && (
            <div className="flex space-x-2 mr-4">
              <button
                onClick={() => navigate("/login")}
                className="btn btn-ghost hover:bg-gray-100"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn btn-outline btn-primary"
              >
                Register
              </button>
            </div>
          )}

          <Link
            to="/counsellor"
            className="btn btn-primary bg-blue-500 hover:bg-blue-600 w-24 sm:w-32 h-12 text-white font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          >
            Counsellor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
