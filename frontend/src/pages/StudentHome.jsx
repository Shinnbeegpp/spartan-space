import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { getDashboardPath, saveAuthSession } from '../auth';

export default function StudentHome() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google-login-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const dashboardPath = getDashboardPath(data.user?.role);

        if (!data.token || !dashboardPath) {
          alert('Login Failed: Invalid authentication response');
          return;
        }

        saveAuthSession(data.token, data.user.role);
        navigate(dashboardPath, { replace: true });
      } else {
        alert(`Login Failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <main className="portal-page">
      <aside className="portal-sidebar" aria-label="Student portal navigation">
        <a className="brand brand-inverse" href="/">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>SpartanSpaces</span>
        </a>

        <nav className="portal-menu" aria-label="Main navigation">
          <a className="portal-menu-item active" href="/">Home</a>
          <a className="portal-menu-item" href="/landlord">Landlord Portal</a>
          <span className="portal-menu-item muted" aria-disabled="true">Housing</span>
          <span className="portal-menu-item muted" aria-disabled="true">Resources</span>
        </nav>
      </aside>

      <section className="portal-main" aria-labelledby="student-home-title">
        <header className="portal-topbar">
          <div>
            <p className="eyebrow">Batangas State University</p>
            <h1 id="student-home-title">Student Home</h1>
          </div>
          <span className="portal-badge">Spartan Portal</span>
        </header>

        <section className="student-hero">
          <div className="hero-copy">
            <p className="eyebrow">Welcome to SpartanSpaces</p>
            <h2>Find your space, stay connected, and move with Spartan discipline.</h2>
            <p>
              A focused student portal experience for BatStateU housing access, updates,
              academic reminders, and essential campus resources.
            </p>
          </div>

          <div className="signin-card" aria-label="Student sign in">
            <div>
              <span className="card-kicker">Student access</span>
              <h3>Continue with your university Google account</h3>
              <p>Use your authorized student account to access supported portal services.</p>
            </div>
            <div className="google-login-wrap">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Google Login Failed')}
              />
            </div>
          </div>
        </section>

        <section className="dashboard-grid" aria-label="Student dashboard overview">
          <article className="dashboard-card profile-card">
            <span className="card-kicker">Profile summary</span>
            <h3>Student account</h3>
            <p>
              Sign in to connect your SpartanSpaces profile with your student account and
              view available portal details.
            </p>
          </article>

          <article className="dashboard-card">
            <span className="card-kicker">Quick access</span>
            <div className="action-list">
              <span className="action-link inactive">Browse housing options</span>
              <span className="action-link inactive">Review student resources</span>
              <a href="/landlord" className="action-link">Open landlord portal</a>
            </div>
          </article>

          <article className="dashboard-card accent-card">
            <span className="card-kicker">Important notice</span>
            <h3>Keep your account secure</h3>
            <p>
              Always use your official student Google account when accessing SpartanSpaces.
            </p>
          </article>

          <article className="dashboard-card">
            <span className="card-kicker">Announcements</span>
            <ul className="portal-list">
              <li>Housing updates and student reminders will appear here.</li>
              <li>Portal notices are organized for quick review.</li>
            </ul>
          </article>

          <article className="dashboard-card">
            <span className="card-kicker">Academic snapshot</span>
            <div className="summary-row">
              <span>Current status</span>
              <strong>Ready for sign in</strong>
            </div>
            <div className="summary-row">
              <span>Portal access</span>
              <strong>Google account required</strong>
            </div>
          </article>

          <article className="dashboard-card">
            <span className="card-kicker">Upcoming activities</span>
            <ul className="portal-list timeline-list">
              <li>Campus housing reminders</li>
              <li>Student services updates</li>
              <li>Academic calendar notices</li>
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}
