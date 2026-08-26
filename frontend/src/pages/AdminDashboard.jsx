import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [landlords, setLandlords] = useState([]);
  
  // 1. Fetch unverified landlords when the page loads
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
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchUnverifiedLandlords();
  }, []);

  // 2. Approve a landlord (Restored!)
  const approveLandlord = async (id) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/approve-landlord/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        alert('Landlord successfully verified!');
        // Remove the approved landlord from the screen immediately
        setLandlords(landlords.filter(landlord => landlord.id !== id));
      }
    } catch (error) {
      console.error('Error approving landlord:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Super Admin Dashboard</h2>
      <h3>Pending Landlord Approvals</h3>
      
      {landlords.length === 0 ? (
        <p>No landlords waiting for approval. Great job!</p>
      ) : (
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid black' }}>
              <th>ID</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {landlords.map((landlord) => (
              <tr key={landlord.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '0.5rem 0' }}>{landlord.id}</td>
                <td>{landlord.email}</td>
                <td>
                  <button 
                    onClick={() => approveLandlord(landlord.id)}
                    style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}