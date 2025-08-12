import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useAuth } from "../component/context/authContext.jsx";
import { Link, useLocation } from "react-router-dom";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const [UserDetails, setUserDetails] = useState(null);
  const [infoReports, setInfoReports] = useState([]);
  const [adminAnswers, setAdminAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("messages");
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Toggle sidebar function
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    // Close sidebar when navigating away from dashboard
    if (location.pathname !== "/dashboard" && location.pathname !== "/admin") {
      setIsSidebarOpen(false);
    }

    // Fetch user details
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch details");
        return res.json();
      })
      .then((data) => {
        setUserDetails(data);
      })
      .catch((err) => setError(err.message));

    // Fetch info reports for current user
    fetch(`/api/userinfo/user/${currentUser._id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch info reports");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Info Reports:", data);
        setInfoReports(data);
      })
      .catch((err) => setError(err.message));

    // Fetch admin answers for current user
    const fetchUserAnswers = async () => {
      try {
        const res = await fetch(`/api/adminanswers/user/${currentUser._id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch answers");
        const data = await res.json();

        // Create a map of report IDs to their answers
        const answersMap = {};
        data.forEach((answer) => {
          const reportId = answer.infoReportId?._id || answer.infoReportId;
          if (!answersMap[reportId]) {
            answersMap[reportId] = [];
          }
          answersMap[reportId].push(answer);
        });

        setAdminAnswers(answersMap);
      } catch (err) {
        console.error("Error fetching answers:", err);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAnswers();
  }, [currentUser, location]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      setError(null);

      // Check if we have all required user details
      if (!UserDetails) {
        throw new Error("User details are still loading. Please try again.");
      }

      // Prepare the data with all required fields
      const requestData = {
        userId: currentUser._id,
        fullname: UserDetails.name,
        // email: UserDetails.email,
        phone: UserDetails.phone || "Not provided", // Provide a default if missing
        studentRef: UserDetails.studentRef || "Not provided", // Provide a default if missing
        category: "dashboard-message", // Set a specific category for dashboard messages
        description: newMessage,
      };

      const response = await fetch("/api/userinfo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send message: ${errorText}`);
      }

      const data = await response.json();

      // Add the new message to existing reports
      setInfoReports((prev) => [data, ...prev]);

      // Initialize answers for this new report
      setAdminAnswers((prev) => ({
        ...prev,
        [data._id]: [],
      }));

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);

      // Handle duplicate email error
      if (
        err.message.includes("DUPLICATE_EMAIL") ||
        err.message.includes("already exists")
      ) {
        setError(
          "This email address has already been used for a previous report. Please use a different email or contact support."
        );
      } else if (err.message.includes("Failed to send message")) {
        setError(
          "Failed to send message. Please try again or contact support."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setIsSending(false);
    }
  };

  const messageThreads = useMemo(() => {
    if (!infoReports.length && !Object.keys(adminAnswers).length) return [];

    return infoReports
      .map((report) => {
        const answers = adminAnswers[report._id] || [];
        return {
          report,
          answers: answers.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          ),
          latestDate: answers.length
            ? answers[answers.length - 1].createdAt
            : report.createdAt,
        };
      })
      .sort((a, b) => new Date(a.latestDate) - new Date(b.latestDate)); // Changed to chronological order
  }, [infoReports, adminAnswers]);

  // Helper to format date/time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate total responses for profile
  const totalResponses = useMemo(() => {
    return Object.values(adminAnswers).reduce(
      (total, answers) => total + answers.length,
      0
    );
  }, [adminAnswers]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with border and shadow */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-gray-700 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-xl border-r border-gray-300`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600">
                  {currentUser?.name?.charAt(0) || "U"}
                </span>
              </div>
              <span className="font-semibold">Dashboard</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-red-200 `}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#about"
                    className="block py-2.5 px-4 rounded transition duration-200 hover:bg-red-200"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/advice"
                    className="block py-2.5 px-4 rounded transition duration-200 hover:bg-red-200"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Resources
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("messages")}
                    className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-red-200 ${
                      activeTab === "messages" ? "bg-red-200" : ""
                    }`}
                  >
                    Messages
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-red-200 ${
                      activeTab === "profile" ? "bg-red-200" : ""
                    }`}
                  >
                    My Profile
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-300">
            <button
              onClick={logout}
              className="w-full py-2.5 px-4 rounded transition duration-200 hover:bg-red-300 text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}
        <div className="container mx-auto px-4 pt-20 pb-8 md:pt-8">
          <div className="md:hidden fixed top-4 left-4 z-50">
            <button
              ref={menuButtonRef}
              onClick={toggleSidebar}
              className="bg-white text-gray-500 px-4 py-2 rounded-lg flex items-center shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {isSidebarOpen ? "" : ""}
            </button>
          </div>
          {activeTab === "messages" && (
            <>
              <h1 className="text-3xl font-bold mb-6">Messages</h1>
              {!loading && !error && (
                <div className="space-y-6">
                  {messageThreads.length === 0 ? (
                    <p>No messages found.</p>
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-4">
                      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                        {messageThreads.map((thread) => (
                          <div
                            key={thread.report._id}
                            className="mb-6 last:mb-0"
                          >
                            <div className="flex flex-col space-y-3 p-4 border-b border-gray-200 last:border-b-0">
                              {/* User's original message */}
                              <div className="flex justify-end">
                                <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg bg-blue-500 text-white">
                                  <div className="font-semibold">You</div>
                                  <p className="text-sm">
                                    {thread.report.description}
                                  </p>
                                  <p className="text-xs opacity-80 text-right mt-1">
                                    {formatDateTime(thread.report.createdAt)}
                                  </p>
                                </div>
                              </div>
                              {/* Admin responses */}
                              {thread.answers.map((answer) => (
                                <div
                                  key={answer._id}
                                  className="flex justify-start"
                                >
                                  <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
                                    <div className="font-semibold">Admin</div>
                                    <p className="text-sm">
                                      {answer.answerText}
                                    </p>
                                    <p className="text-xs opacity-80 text-right mt-1">
                                      {formatDateTime(answer.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="sticky bottom-0 bg-white p-4 border-t">
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 border rounded-l-lg p-2"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            disabled={isSending}
                          />
                          <button
                            className={`bg-blue-500 text-white px-4 rounded-r-lg ${
                              isSending ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            onClick={handleSendMessage}
                            disabled={isSending}
                          >
                            {isSending ? "Sending..." : "Send"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "profile" && (
            <>
              <h1 className="text-3xl font-bold mb-6">My Profile</h1>

              {loading && <p>Loading profile...</p>}
              {error && <p className="text-red-600">{error}</p>}

              {!loading && !error && UserDetails && (
                <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-gray-600">
                        {UserDetails.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{UserDetails.name}</h2>
                      <p className="text-gray-600 capitalize">
                        {UserDetails.role}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-2">
                        Personal Information
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">
                            {UserDetails.name}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">
                            {UserDetails.email}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">
                            {UserDetails.phone || "Not provided"}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Student Ref:</span>
                          <span className="font-medium">
                            {UserDetails.studentRef || "Not provided"}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-2">
                        Account Information
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-gray-600">
                            Account Created:
                          </span>
                          <span className="font-medium">
                            {formatDateTime(UserDetails.createdAt)}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Role:</span>
                          <span className="font-medium capitalize">
                            {UserDetails.role}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">
                            Reports Submitted:
                          </span>
                          <span className="font-medium">
                            {infoReports.length}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">
                            Responses Received:
                          </span>
                          <span className="font-medium">{totalResponses}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                      onClick={() => setActiveTab("messages")}
                    >
                      View Messages
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
