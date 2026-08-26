import { useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../auth';

export default function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate('/', { replace: true });
  };

  return (
    <main className="portal-page">
      <aside className="portal-sidebar" aria-label="Student dashboard navigation">
        <a className="brand brand-inverse" href="/student/dashboard">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>SpartanSpaces</span>
        </a>

        <nav className="portal-menu" aria-label="Student navigation">
          <a className="portal-menu-item active" href="/student/dashboard">Home</a>
          <span className="portal-menu-item muted" aria-disabled="true">My Dorm</span>
          <span className="portal-menu-item muted" aria-disabled="true">Applications</span>
          <span className="portal-menu-item muted" aria-disabled="true">Maintenance</span>
          <button className="portal-menu-item portal-menu-button" type="button" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </aside>

      <section className="portal-main" aria-labelledby="student-dashboard-title">
        <header className="portal-topbar">
          <div>
            <p className="eyebrow">Student portal</p>
            <h1 id="student-dashboard-title">Student Dashboard</h1>
          </div>
          <span className="portal-badge">Verified Student</span>
        </header>

        <section className="dashboard-grid" aria-label="Student dashboard overview">
          <article className="dashboard-card profile-card">
            <span className="card-kicker">Housing</span>
            <h3>Find your next space</h3>
            <p>Browse available housing and review dorm details from your student account.</p>
          </article>

          <article className="dashboard-card">
            <span className="card-kicker">Applications</span>
            <h3>Your requests</h3>
            <p>Application updates and landlord responses will appear here.</p>
          </article>

          <article className="dashboard-card accent-card">
            <span className="card-kicker">My Dorm</span>
            <h3>Lease and room details</h3>
            <p>Your active dorm information will be available after landlord assignment.</p>
          </article>
        </section>
      </section>
    </main>
  );
}
