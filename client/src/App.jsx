import { Navigate, Route, Routes } from 'react-router-dom';

import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import ContestsPage from './pages/ContestsPage';
import DashboardPage from './pages/DashboardPage';
import InterviewRoomPage from './pages/InterviewRoomPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProblemSolvePage from './pages/ProblemSolvePage';
import ProblemsPage from './pages/ProblemsPage';
import RegisterPage from './pages/RegisterPage';
import SubmissionsPage from './pages/SubmissionsPage';
import UsersInsightsPage from './pages/UsersInsightsPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import PublicProfilePage from './pages/PublicProfilePage';
const App = () => {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problems/:slug" element={<ProblemSolvePage />} />
        <Route path="/submissions" element={<SubmissionsPage />} />
        <Route path="/contests" element={<ContestsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/users-insights" element={<UsersInsightsPage />} />
        <Route path="/profile" element={<PublicProfilePage />} />
        <Route path="/settings" element={<ProfileSettingsPage />} />
        <Route path="/interview/:roomId" element={<InterviewRoomPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
