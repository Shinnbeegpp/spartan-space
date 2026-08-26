import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandlordAuth from './pages/landlordAuth';
import StudentHome from './pages/StudentHome';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import LandlordDashboard from './pages/LandlordDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/landlord" element={<LandlordAuth />} />
        <Route
          path="/student/dashboard"
          element={(
            <ProtectedRoute allowedRole="student" loginPath="/">
              <StudentDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/landlord/dashboard"
          element={(
            <ProtectedRoute allowedRole="landlord" loginPath="/landlord">
              <LandlordDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin"
          element={(
            <ProtectedRoute allowedRole="admin" loginPath="/landlord">
              <AdminDashboard />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
