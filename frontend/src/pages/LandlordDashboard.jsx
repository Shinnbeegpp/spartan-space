import { useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../auth';

export default function LandlordDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate('/landlord', { replace: true });
  };

  return (
    <main className="portal-page">
      <aside className="portal-sidebar" aria-label="Landlord dashboard navigation">
        <a className="brand brand-inverse" href="/landlord/dashboard">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>SpartanSpaces</span>
        </a>

        <nav className="portal-menu" aria-label="Landlord navigation">
          <a className="portal-menu-item active" href="/landlord/dashboard">Home</a>
          <span className="portal-menu-item muted" aria-disabled="true">Properties</span>
          <span className="portal-menu-item muted" aria-disabled="true">Applications</span>
          <span className="portal-menu-item muted" aria-disabled="true">Maintenance</span>
          <button className="portal-menu-item portal-menu-button" type="button" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </aside>

      <section className="portal-main" aria-labelledby="landlord-dashboard-title">
        <header className="portal-topbar">
          <div>
            <p className="eyebrow">Landlord portal</p>
            <h1 id="landlord-dashboard-title">Landlord Dashboard</h1>
          </div>
          <span className="portal-badge">Property Manager</span>
        </header>

        <section className="dashboard-grid" aria-label="Landlord dashboard overview">
          <article className="dashboard-card profile-card">
            <span className="card-kicker">Properties</span>
            <h3>Manage listings</h3>
            <p>Your properties, room details, pricing, and availability will appear here.</p>
          </article>

          <article className="dashboard-card">
            <span className="card-kicker">Applications</span>
            <h3>Tenant requests</h3>
            <p>Review incoming student applications and onboarding updates.</p>
          </article>

          <article className="dashboard-card accent-card">
            <span className="card-kicker">Operations</span>
            <h3>Occupancy and maintenance</h3>
            <p>Track available rooms, active tenants, and reported issues.</p>
          </article>
        </section>
      </section>
    </main>
  );
}
