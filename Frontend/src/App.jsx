import React from "react";
import Navbar from "./component/common/Navbar.jsx";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ResourcesPage from "./pages/ResourcesPage.jsx";
import Footer from "./component/common/Footer.jsx";
import Peer_counsellor from "./component/common/Peer_counsellor.jsx";
import Counsellor from "./component/common/Counsellor.jsx";
import AnonymousMessage from "./component/common/Anonymousmessages.jsx";
import FeedbackForm from "./component/common/Feedback.jsx";
import Myinfo from "./component/common/Myinfo.jsx";
import AdviceSection from "./component/common/advice.jsx";
import LoginPage from "./pages/loginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { ProtectedRoute } from "./component/protectedRoutes.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { AuthProvider } from "./component/context/authContext.jsx";
import { ErrorBoundary } from "react-error-boundary";
import Dashboard from "./pages/Dashboard.jsx";

// Layout component for routes with Navbar and Footer
const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const AppContent = () => {
  return (
    <Routes>
      {/* Routes with Navbar/Footer */}
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <>
              <HomePage />
              <ResourcesPage />
              <AboutUs />
            </>
          }
        />
        <Route path="/advice" element={<AdviceSection />} />
        <Route path="/peer" element={<Peer_counsellor />} />
        <Route path="/counsellor" element={<Counsellor />} />
        <Route path="/anonymous" element={<AnonymousMessage />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route
          path="/withinfo"
          element={
            <ProtectedRoute>
              <Myinfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Routes without Navbar/Footer */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <div className="flex flex-col max-w-6xl">
      <ErrorBoundary
        FallbackComponent={({ error }) => (
          <div className="text-red-500 text-center p-4">
            An error occurred: {error.message}
          </div>
        )}
      >
        <Router>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </div>
  );
};

export default App;
