import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../component/context/authContext.jsx";
import { Link, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import AdviceManager from "../component/AdviceManager";
import UserManagement from "../component/UserManagement.jsx";

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [anonymousReports, setAnonymousReports] = useState([]);
  const [infoReports, setInfoReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [urgentNotifications, setUrgentNotifications] = useState([]);
  const [loadingUrgent, setLoadingUrgent] = useState(true);
  const [errorUrgent, setErrorUrgent] = useState(null);
  const [newAnswers, setNewAnswers] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [adminAnswers, setAdminAnswers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [solvedReports, setSolvedReports] = useState(new Set());

  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Toggle sidebar function
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Fix the submitAnswer function to use the report's user ID
  const submitAnswer = async (report, answerText) => {
    if (!answerText.trim()) return;

    // Debugging: Log the report object to see its structure
    console.log("Report object:", report);
    console.log("Report userId:", report.userId);
    console.log("Report _id:", report._id);
    console.log("Answer text:", answerText.trim());

    // Check if required fields are present
    if (!report._id) {
      console.error("Missing report ID");
      setSubmitting((prev) => ({ ...prev, [report._id]: false }));
      return;
    }

    setSubmitting((prev) => ({ ...prev, [report._id]: true }));

    try {
      const response = await fetch("/api/adminanswers/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: report.userId, // Use the report owner's ID
          infoReportId: report._id,
          answerText: answerText.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to submit answer: ${errorData.message || response.statusText}`
        );
      }

      const newAnswer = await response.json();
      setAdminAnswers((prev) => [...prev, newAnswer]);
      setNewAnswers((prev) => ({ ...prev, [report._id]: "" }));

      // Mark as solved immediately
      toggleSolved(report._id);
    } catch (error) {
      console.error("Error submitting answer:", error);
      // Optionally, show an error message to the user
    } finally {
      setSubmitting((prev) => ({ ...prev, [report._id]: false }));
    }
  };

  useEffect(() => {
    // Close sidebar when navigating away from admin dashboard
    if (!location.pathname.startsWith("/admin")) {
      setIsSidebarOpen(false);
    }

    // Initialize solvedReports from localStorage
    const savedSolved = localStorage.getItem("solvedReports");
    if (savedSolved) {
      try {
        setSolvedReports(new Set(JSON.parse(savedSolved)));
      } catch (e) {
        console.error("Failed to parse solvedReports", e);
      }
    }

    // Fetch all data
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersRes = await fetch("/api/auth/all", {
          credentials: "include",
        });
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        const usersData = await usersRes.json();
        setUsers(usersData);

        // Fetch anonymous reports
        const anonRes = await fetch("/api/anonymous/all", {
          credentials: "include",
        });
        if (!anonRes.ok) throw new Error("Failed to fetch anonymous reports");
        const anonData = await anonRes.json();
        console.log(anonData);
        setAnonymousReports(anonData);

        // Fetch info reports
        const infoRes = await fetch("/api/userinfo/all", {
          credentials: "include",
        });
        if (!infoRes.ok) throw new Error("Failed to fetch info reports");
        const infoData = await infoRes.json();
        setInfoReports(infoData);

        const answersRes = await fetch("/api/adminanswers/all", {
          credentials: "include",
        });
        if (!answersRes.ok) throw new Error("Failed to fetch admin answers");
        const answersData = await answersRes.json();
        setAdminAnswers(answersData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Fetch urgent notifications
    const fetchUrgentNotifications = async () => {
      try {
        setLoadingUrgent(true);
        const response = await fetch("/api/admin/urgent", {
          credentials: "include",
        });
        if (!response.ok)
          throw new Error("Failed to fetch urgent notifications");
        const data = await response.json();
        console.log("Urgent notifications fetched:", data); // Added debug log
        setUrgentNotifications(data);
        setLoadingUrgent(false);
      } catch (err) {
        setErrorUrgent(err.message);
        setLoadingUrgent(false);
      }
    };

    fetchUrgentNotifications();
  }, []);

  // Toggle solved checkbox
  const toggleSolved = (id) => {
    const newSet = new Set(solvedReports);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSolvedReports(newSet);
    localStorage.setItem("solvedReports", JSON.stringify([...newSet]));
  };

  // Resolve urgent notification
  const resolveNotification = async (id) => {
    try {
      await fetch(`/api/admin/urgent/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setUrgentNotifications(urgentNotifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to resolve notification:", err);
    }
  };

  // Get recent concerns (both types)
  const getRecentConcerns = () => {
    const allConcerns = [
      ...infoReports.map((r) => ({ ...r, type: "info", date: r.createdAt })),
      ...anonymousReports.map((r) => ({
        ...r,
        type: "anonymous",
        date: r.createdAt,
      })),
    ];

    return allConcerns
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  // Calculate metrics
  const metrics = {
    totalUsers: users.length,
    infoConcerns: infoReports.length,
    anonymousConcerns: anonymousReports.length,
    answeredConcerns: [...solvedReports].length,
  };

  // Get solved count for a report type
  const getSolvedCount = (reports) =>
    reports.filter((r) => solvedReports.has(r._id)).length;

  // Update getSentiment function to handle both compoundScore and sentiment string
  const getSentiment = (report, type) => {
    if (!report) {
      return { label: "N/A", color: "bg-gray-100 text-gray-800" };
    }
    if (type === "anonymous") {
      // Use sentiment string for anonymous reports
      switch (report.sentiment) {
        case "positive":
          return { label: "Positive", color: "bg-green-100 text-green-800" };
        case "negative":
          return { label: "Negative", color: "bg-red-100 text-red-800" };
        case "neutral":
          return { label: "Neutral", color: "bg-gray-100 text-gray-800" };
        default:
          return { label: "N/A", color: "bg-gray-100 text-gray-800" };
      }
    } else {
      // Use compoundScore for info reports
      const score = report.compoundScore;
      if (score === undefined || score === null) {
        return { label: "N/A", color: "bg-gray-100 text-gray-800" };
      }
      if (score <= -0.5) {
        return { label: "Negative", color: "bg-red-100 text-red-800" };
      } else if (score >= 0.5) {
        return { label: "Positive", color: "bg-green-100 text-green-800" };
      }
      return { label: "Neutral", color: "bg-gray-100 text-gray-800" };
    }
  };

  if (loading || loadingUrgent)
    return (
      <div className="container mx-auto px-4 py-8">Loading dashboard...</div>
    );
  if (error || errorUrgent)
    return (
      <div className="container mx-auto px-4 py-8 text-red-600">
        Error: {error || errorUrgent}
      </div>
    );

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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Always accessible with responsive behavior */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-gray-700 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shadow-xl border-r border-gray-300`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600">
                  {currentUser?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div>
                <span className="font-semibold block">Admin Dashboard</span>
                <span className="text-sm text-gray-600">
                  {currentUser?.name || "Admin"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-purple-200 `}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#about"
                    className="block py-2.5 px-4 rounded transition duration-200 hover:bg-purple-200"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/advice"
                    className="block py-2.5 px-4 rounded transition duration-200 hover:bg-purple-200"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Resources
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-purple-200 ${
                      activeTab === "overview" ? "bg-purple-200" : ""
                    }`}
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <div className="text-sm font-semibold text-gray-500 px-4 py-2">
                    Reports
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("infoReports")}
                    className={`block w-full text-left py-1 px-4 ml-5 rounded transition duration-200 hover:bg-purple-200 ${
                      activeTab === "infoReports" ? "bg-purple-200" : ""
                    }`}
                  >
                    Info Reports
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("anonymousReports")}
                    className={`block w-full text-left py-2 px-4 ml-5 rounded transition duration-200 hover:bg-purple-200 ${
                      activeTab === "anonymousReports" ? "bg-purple-200" : ""
                    }`}
                  >
                    Anonymous Reports
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("userManagement")}
                    className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-purple-200 ${
                      activeTab === "userManagement" ? "bg-purple-200" : ""
                    }`}
                  >
                    User Management
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("advice")}
                    className={`block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-purple-200 ${
                      activeTab === "advice" ? "bg-purple-200" : ""
                    }`}
                  >
                    Advice Articles
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-300">
            <button
              onClick={logout}
              className="w-full py-2.5 px-4 rounded transition duration-200 hover:bg-purple-300 text-left"
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

          {activeTab === "advice" && <AdviceManager />}

          {/* Urgent Notifications Banner */}
          {urgentNotifications.length > 0 && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">Urgent Notifications!</p>
                  <p className="text-sm">
                    {urgentNotifications.length} urgent reports need attention
                  </p>
                </div>
              </div>
              <ul className="mt-3 space-y-2">
                {urgentNotifications.map((notification) => (
                  <li
                    key={notification._id}
                    className="flex justify-between items-center py-1 px-2 bg-red-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-xs text-red-600">
                        Sentiment score:{" "}
                        {notification.sentimentScore.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => resolveNotification(notification._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Resolve
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h1 className="text-3xl font-bold mb-6">Admin Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div
                  onClick={() => setActiveTab("userManagement")}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <MetricCard
                    title="Total Users"
                    value={metrics.totalUsers}
                    change="+5.2%"
                    icon="👥"
                  />
                </div>
                <MetricCard
                  title="Info Concerns"
                  value={metrics.infoConcerns}
                  change="+12.4%"
                  icon="📝"
                />
                <MetricCard
                  title="Anonymous Concerns"
                  value={metrics.anonymousConcerns}
                  change="+8.3%"
                  icon="🕵️"
                />
                <MetricCard
                  title="Answered Concerns"
                  value={metrics.answeredConcerns}
                  change={`+${Math.round(
                    (metrics.answeredConcerns /
                      (metrics.infoConcerns + metrics.anonymousConcerns) || 0) *
                      100
                  )}%`}
                  icon="✅"
                />
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Recent Concerns</h2>
                <div className="space-y-4">
                  {getRecentConcerns().map((concern) => {
                    const sentiment = getSentiment(concern, concern.type);

                    return (
                      <ConcernItem
                        key={concern._id}
                        concern={concern}
                        solved={solvedReports.has(concern._id)}
                        onToggleSolved={() => toggleSolved(concern._id)}
                        sentiment={sentiment}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Info Reports Tab */}
          {activeTab === "userManagement" && <UserManagement users={users} />}
          {activeTab === "infoReports" && (
            <div className="flex flex-col md:flex-row gap-8">
              <ReportSection
                title="Info Reports"
                reports={infoReports}
                solvedCount={getSolvedCount(infoReports)}
                type="info"
                solvedReports={solvedReports}
                toggleSolved={toggleSolved}
                getSentiment={getSentiment}
                adminAnswers={adminAnswers}
                newAnswers={newAnswers}
                setNewAnswers={setNewAnswers}
                submitAnswer={submitAnswer}
                submitting={submitting}
              />
            </div>
          )}

          {/* Anonymous Reports Tab */}
          {activeTab === "anonymousReports" && (
            <div className="flex flex-col md:flex-row gap-8">
              <ReportSection
                title="Anonymous Reports"
                reports={anonymousReports}
                solvedCount={getSolvedCount(anonymousReports)}
                type="anonymous"
                solvedReports={solvedReports}
                toggleSolved={toggleSolved}
                getSentiment={getSentiment}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for metric cards
function MetricCard({ title, value, change, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className="text-green-600 text-sm font-medium mt-2">{change}</p>
        </div>
        <div className="bg-purple-100 p-3 rounded-lg text-purple-700 text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

// Component for concern items
function ConcernItem({ concern, solved, onToggleSolved, sentiment }) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        solved ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="font-semibold">
              {concern.type === "info" ? concern.fullname : "Anonymous"}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${sentiment.color}`}
            >
              {sentiment.label}
            </span>

            {concern.type === "info" && concern.category && (
              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                {concern.category}
              </span>
            )}
            <span className="text-gray-500 text-xs">
              {formatDate(concern.date)}
            </span>
          </div>
          <p className="text-gray-700">
            {concern.message || concern.description}
          </p>
        </div>
        <label className="flex items-center cursor-pointer">
          <span className="mr-2 text-sm text-gray-600">Solved</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={solved}
              onChange={onToggleSolved}
              className="sr-only"
            />
            <div
              className={`block w-10 h-6 rounded-full ${
                solved ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                solved ? "transform translate-x-4" : ""
              }`}
            ></div>
          </div>
        </label>
      </div>
    </div>
  );
}

// Updated ReportSection component with answer functionality
function ReportSection({
  title,
  reports,
  solvedCount,
  type,
  solvedReports,
  toggleSolved,
  getSentiment,
  adminAnswers = [],
  newAnswers = {},
  setNewAnswers,
  submitAnswer,
  submitting = {},
}) {
  // Get answers for a specific report
  const getAnswersForReport = (reportId) => {
    return adminAnswers.filter(
      (answer) =>
        answer.infoReportId === reportId ||
        answer.infoReportId?._id === reportId
    );
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-purple-700 text-white p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm opacity-80">
          {solvedCount} of {reports.length} solved
        </p>
      </div>

      <div className="p-4 max-h-[600px] overflow-y-auto">
        {reports.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reports found</p>
        ) : (
          reports.map((report) => {
            const sentiment = getSentiment(report, type);
            const reportAnswers = getAnswersForReport(report._id);

            return (
              <div
                key={report._id}
                className={`mb-4 p-4 rounded-lg ${
                  solvedReports.has(report._id) ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <div className="w-full">
                        {/* Moved fullname display to the top */}
                        {type === "info" && (
                          <div className="mb-2">
                            <span className="font-semibold text-gray-800">
                              {report.fullname || "User"}
                            </span>
                          </div>
                        )}

                        {/* Message bubble */}
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                          <p className="text-gray-700">
                            {report.message || report.description}
                          </p>
                        </div>

                        {/* Meta information */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-gray-500 text-xs">
                            {formatDate(report.createdAt)}
                          </span>
                          {report.category && (
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {report.category}
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${sentiment.color}`}
                          >
                            {sentiment.label}
                          </span>
                        </div>

                        {/* Admin Answers Section */}
                        {type === "info" && (
                          <div className="mt-4">
                            {reportAnswers.length > 0 && (
                              <div className="mb-3">
                                <h3 className="font-semibold text-gray-700 mb-2">
                                  Admin Answers:
                                </h3>
                                {reportAnswers.map((answer) => (
                                  <div
                                    key={answer._id}
                                    className="bg-blue-50 p-3 rounded-lg mb-2 border border-blue-200"
                                  >
                                    <p className="text-gray-700">
                                      {answer.answerText}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {formatDate(answer.createdAt)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Answer Form */}
                            <div className="mt-3">
                              <textarea
                                value={newAnswers[report._id] || ""}
                                onChange={(e) =>
                                  setNewAnswers((prev) => ({
                                    ...prev,
                                    [report._id]: e.target.value,
                                  }))
                                }
                                placeholder="Type your response here..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows={3}
                              />
                              <button
                                onClick={() =>
                                  submitAnswer(report, newAnswers[report._id])
                                }
                                disabled={submitting[report._id]}
                                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                              >
                                {submitting[report._id]
                                  ? "Sending..."
                                  : "Send Response"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Solved toggle */}
                  <label className="flex items-center cursor-pointer ml-4 flex-shrink-0">
                    <span className="mr-2 text-sm text-gray-600">Solved</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={solvedReports.has(report._id)}
                        onChange={() => toggleSolved(report._id)}
                        className="sr-only"
                      />
                      <div
                        className={`block w-10 h-6 rounded-full ${
                          solvedReports.has(report._id)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          solvedReports.has(report._id)
                            ? "transform translate-x-4"
                            : ""
                        }`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Format date function
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
