import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandlordAuth from './pages/landlordAuth';
import StudentHome from './pages/StudentHome';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/landlord" element={<LandlordAuth />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
