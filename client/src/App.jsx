import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Public Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

// User Dashboard Pages
import UserDashboardLayout from './pages/dashboard/UserDashboardLayout';
import UserOverviewPage from './pages/dashboard/UserOverviewPage';
import NewProjectRequestPage from './pages/dashboard/NewProjectRequestPage';
import MyProjectsPage from './pages/dashboard/MyProjectsPage';
import ProjectDetailPage from './pages/dashboard/ProjectDetailPage';
import ProfileSettingsPage from './pages/dashboard/ProfileSettingsPage';

// Admin Dashboard Pages
import AdminDashboardLayout from './pages/admin/AdminDashboardLayout';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminProjectDetailPage from './pages/admin/AdminProjectDetailPage';
import AdminPortfolioPage from './pages/admin/AdminPortfolioPage';
import AdminContactPage from './pages/admin/AdminContactPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Public Layout Wrapper with Navbar & Footer
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Routes with standard Navigation and Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* User Client Portal (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserOverviewPage />} />
        <Route path="new-project" element={<NewProjectRequestPage />} />
        <Route path="projects" element={<MyProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="profile" element={<ProfileSettingsPage />} />
      </Route>

      {/* Admin Operations Console (Admin Only) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="projects/:id" element={<AdminProjectDetailPage />} />
        <Route path="portfolio" element={<AdminPortfolioPage />} />
        <Route path="contact" element={<AdminContactPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>
    </Routes>
  );
}

export default App;

