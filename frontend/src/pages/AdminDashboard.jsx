import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../auth';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [landlords, setLandlords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    const fetchUnverifiedLandlords = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5000/api/admin/unverified-landlords', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
          setLandlords(data);
        } else {
          console.error('Failed to fetch:', data.error);
          setErrorMessage(data.error || 'Unable to load pending landlord approvals.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setErrorMessage('Unable to connect to the server. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnverifiedLandlords();
  }, []);

  const approveLandlord = async (id) => {
    const token = localStorage.getItem('token');

    setApprovingId(id);
    setErrorMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/admin/approve-landlord/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        alert('Landlord successfully verified!');
        setLandlords((currentLandlords) => (
          currentLandlords.filter((landlord) => landlord.id !== id)
        ));
      } else {
        setErrorMessage(data.error || 'Unable to approve this landlord.');
      }
    } catch (error) {
      console.error('Error approving landlord:', error);
      setErrorMessage('Unable to connect to the server. Please try again.');
    } finally {
      setApprovingId(null);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate('/landlord', { replace: true });
  };

  const queueStatus = landlords.length > 0 ? 'Action required' : 'Up to date';

  return (
    <main className="portal-page">
      <aside className="portal-sidebar" aria-label="Super Admin dashboard navigation">
        <a className="brand brand-inverse" href="/admin">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>SpartanSpaces</span>
        </a>

        <nav className="portal-menu" aria-label="Super Admin navigation">
          <a className="portal-menu-item active" href="/admin">Overview</a>
          <a className="portal-menu-item" href="#landlord-approvals">Landlord approvals</a>
          <span className="portal-menu-item muted" aria-disabled="true">User management</span>
          <span className="portal-menu-item muted" aria-disabled="true">Reports</span>
          <button className="portal-menu-item portal-menu-button" type="button" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      </aside>

      <section className="portal-main" aria-labelledby="admin-dashboard-title">
        <header className="portal-topbar">
          <div>
            <p className="eyebrow">Administration</p>
            <h1 id="admin-dashboard-title">Super Admin Dashboard</h1>
          </div>
          <span className="portal-badge">Super Admin</span>
        </header>

        <section className="admin-summary-grid" aria-label="Approval summary">
          <article className="dashboard-card admin-stat-card profile-card">
            <span className="card-kicker">Pending approvals</span>
            <strong className="admin-stat-value">{isLoading ? '-' : landlords.length}</strong>
            <p>Landlord accounts awaiting identity verification.</p>
          </article>

          <article className="dashboard-card admin-stat-card">
            <span className="card-kicker">Queue status</span>
            <strong className="admin-stat-label">{isLoading ? 'Loading' : queueStatus}</strong>
            <p>Review each account before granting verified access.</p>
          </article>
        </section>

        <section className="admin-panel" id="landlord-approvals" aria-labelledby="approvals-title">
          <div className="admin-panel-header">
            <div>
              <p className="card-kicker">Verification queue</p>
              <h2 id="approvals-title">Pending Landlord Approvals</h2>
              <p>Review registered landlord accounts and approve verified applicants.</p>
            </div>
            {!isLoading && (
              <span className="admin-count-badge">
                {landlords.length} {landlords.length === 1 ? 'account' : 'accounts'}
              </span>
            )}
          </div>

          {errorMessage && (
            <div className="admin-message admin-message-error" role="alert">
              {errorMessage}
            </div>
          )}

          {isLoading ? (
            <div className="admin-empty-state" role="status">Loading pending approvals...</div>
          ) : landlords.length === 0 ? (
            <div className="admin-empty-state">
              <strong>No pending approvals</strong>
              <p>All submitted landlord accounts have been reviewed.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Account ID</th>
                    <th scope="col">Landlord email</th>
                    <th scope="col">Status</th>
                    <th scope="col"><span className="visually-hidden">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {landlords.map((landlord) => (
                    <tr key={landlord.id}>
                      <td className="admin-id-cell">#{landlord.id}</td>
                      <td className="admin-email-cell">{landlord.email}</td>
                      <td><span className="status-badge status-pending">Pending</span></td>
                      <td className="admin-action-cell">
                        <button
                          className="admin-approve-button"
                          type="button"
                          onClick={() => approveLandlord(landlord.id)}
                          disabled={approvingId === landlord.id}
                        >
                          {approvingId === landlord.id ? 'Approving...' : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
