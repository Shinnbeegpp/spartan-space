import { useState } from 'react';

export default function LandlordAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    const endpoint = isLogin ? 'login-landlord' : 'register-landlord';
    
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`Success!`);
        // If they log in, we save the digital ID badge to their browser
        if (data.token) {
            localStorage.setItem('token', data.token);
            alert('Token saved securely!');
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-labelledby="auth-title">
        <nav className="auth-nav" aria-label="SpartanSpaces">
          <a className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">S</span>
            <span>SpartanSpaces</span>
          </a>
        </nav>

        <div className="auth-shell">
          <aside className="auth-intro">
            <p className="eyebrow">Property management portal</p>
            <h1 id="auth-title">Manage your rental spaces with clarity.</h1>
            <p className="intro-copy">
              Access landlord tools for listings, tenant communication, and account activity from one focused workspace.
            </p>

            <div className="metric-row" aria-label="Platform highlights">
              <div>
                <span className="metric-value">24/7</span>
                <span className="metric-label">Account access</span>
              </div>
              <div>
                <span className="metric-value">Secure</span>
                <span className="metric-label">Token-based sessions</span>
              </div>
            </div>
          </aside>

          <section className="auth-card" aria-label={isLogin ? 'Landlord login form' : 'Landlord registration form'}>
            <div className="auth-card-header">
              <p className="eyebrow">Landlord access</p>
              <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
              <p>
                {isLogin
                  ? 'Sign in with your landlord credentials to continue.'
                  : 'Register your landlord account to get started.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <label htmlFor="landlord-email">Email address</label>
              <input
                id="landlord-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="landlord-password">Password</label>
              <input
                id="landlord-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="primary-button">
                {isLogin ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <button type="button" className="switch-button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account? Register here." : 'Already have an account? Log in here.'}
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}
