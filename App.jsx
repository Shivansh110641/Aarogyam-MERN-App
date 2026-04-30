import React, { useState, useEffect } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('auth'); 
  const [authMode, setAuthMode] = useState('login'); 
  const [isLoading, setIsLoading] = useState(false); // 🔥 Simulates Backend Delay
  
  const [userProfile, setUserProfile] = useState({ name: '', email: '', phone: '', bg: 'O+', age: '' });
  
  const [doctors] = useState([
    { _id: "doc_1", name: "Dr. Sharma", specialty: "Cardiologist", exp: "12 Yrs", fee: "₹1000", match: "99%" },
    { _id: "doc_2", name: "Dr. Gupta", specialty: "Dermatologist", exp: "8 Yrs", fee: "₹800", match: "94%" },
    { _id: "doc_3", name: "Dr. Verma", specialty: "Neurologist", exp: "15 Yrs", fee: "₹1500", match: "97%" }
  ]);
  
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const [bookingForm, setBookingForm] = useState({ doctorId: '', date: '', time: '' });

  // --- 🔥 SIMULATED BACKEND API FUNCTIONS ---

  const simulateAPI = (action, delay = 1200) => {
    setIsLoading(true);
    setTimeout(() => {
      action();
      setIsLoading(false);
    }, delay);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    simulateAPI(() => {
      showNotification(`System Authorized: Welcome ${userProfile.name || 'User'}!`);
      setCurrentView('dashboard');
    });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    simulateAPI(() => {
      showNotification("Encrypted Profile Synced Successfully!");
      setCurrentView('dashboard');
    }, 1000);
  };

  const showNotification = (msg) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    simulateAPI(() => {
      const doc = doctors.find(d => d._id === bookingForm.doctorId);
      const newApt = { 
        id: Math.random().toString(36).substr(2, 9),
        doctor: doc, date: bookingForm.date, time: bookingForm.time,
        status: 'Confirmed' 
      };
      setAppointments([newApt, ...appointments]);
      showNotification("Smart Appointment Scheduled!");
      setBookingForm({ doctorId: '', date: '', time: '' });
    }, 1500);
  };

  const cancelAppointment = (id) => {
    simulateAPI(() => {
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: 'Cancelled' } : apt
      ));
      showNotification("Appointment Terminated.");
    }, 800);
  };

  // --- UI COMPONENTS ---

  const renderAuth = () => (
    <div className="glass-card fade-in" style={{ maxWidth: '420px', margin: '80px auto', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🧬</div>
      <h2 className="gradient-text">{authMode === 'login' ? 'Secure Gateway' : 'Patient Onboarding'}</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>Ethara.AI Next-Gen Healthcare</p>
      
      <form onSubmit={handleAuth} className="form-group">
        {authMode === 'register' && (
          <input type="text" className="glass-input" placeholder="Legal Full Name" required 
            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} />
        )}
        <input type="email" className="glass-input" placeholder="Registered Email ID" required 
          onChange={(e) => setUserProfile({...userProfile, email: e.target.value})} />
        <input type="password" className="glass-input" placeholder="Encrypted Password" required />
        
        <button type="submit" className="glow-button" disabled={isLoading}>
          {isLoading ? <span className="loader"></span> : (authMode === 'login' ? 'Authenticate' : 'Initialize Account')}
        </button>
      </form>
      
      <p style={{ marginTop: '20px', cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }} 
         onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
        {authMode === 'login' ? "New Patient? Start Onboarding" : "Returning Patient? Authenticate"}
      </p>
    </div>
  );

  const renderProfile = () => (
    <div className="glass-card fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span>⚙️</span> Profile Configurations</h2>
      <div className="profile-completion">
        <div className="progress-bar"><div className="progress" style={{ width: userProfile.name ? '100%' : '60%' }}></div></div>
        <small>{userProfile.name ? 'Profile 100% Complete' : 'Profile 60% Complete'}</small>
      </div>

      <form onSubmit={handleProfileUpdate} className="form-group" style={{ marginTop: '20px' }}>
        <div className="row-group">
          <input type="text" className="glass-input" value={userProfile.name} onChange={e => setUserProfile({...userProfile, name: e.target.value})} placeholder="Full Name" required/>
          <input type="text" className="glass-input" value={userProfile.phone} onChange={e => setUserProfile({...userProfile, phone: e.target.value})} placeholder="Phone Number" />
        </div>
        <div className="row-group">
          <input type="email" className="glass-input" value={userProfile.email} disabled title="Primary Email Locked" style={{ opacity: 0.7 }}/>
          <select className="glass-input" value={userProfile.bg} onChange={e => setUserProfile({...userProfile, bg: e.target.value})}>
            <option>O+</option><option>A+</option><option>B+</option><option>AB+</option><option>O-</option>
          </select>
        </div>
        <div className="row-group">
           <button type="button" className="glass-button" onClick={() => setCurrentView('dashboard')}>Discard</button>
           <button type="submit" className="glow-button" disabled={isLoading}>
             {isLoading ? <span className="loader"></span> : 'Sync Profile Data'}
           </button>
        </div>
      </form>
    </div>
  );

  const renderDashboard = () => {
    const activeCount = appointments.filter(a => a.status === 'Confirmed').length;
    const cancelCount = appointments.filter(a => a.status === 'Cancelled').length;

    return (
      <div className="fade-in">
        {/* Smart Stats Bar */}
        <div className="stats-grid">
          <div className="stat-card"><h3>{activeCount}</h3><p>Active Bookings</p></div>
          <div className="stat-card"><h3>{cancelCount}</h3><p>Cancelled</p></div>
          <div className="stat-card"><h3>AI</h3><p>System Status: Optimal</p></div>
        </div>

        <div className="grid-container">
          {/* Booking Engine */}
          <div className="glass-card">
            <h2><span>🤖</span> AI-Assisted Booking</h2>
            <form onSubmit={handleBooking} className="form-group">
              <select className="glass-input" value={bookingForm.doctorId} onChange={e => setBookingForm({...bookingForm, doctorId: e.target.value})} required>
                <option value="" disabled>Select Recommended Specialist</option>
                {doctors.map(d => <option key={d._id} value={d._id}>{d.name} ({d.specialty}) - Match: {d.match}</option>)}
              </select>
              <div className="row-group">
                <input type="date" className="glass-input" value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} required />
                <input type="time" className="glass-input" value={bookingForm.time} onChange={e => setBookingForm({...bookingForm, time: e.target.value})} required />
              </div>
              <button type="submit" className="glow-button" disabled={isLoading}>
                {isLoading ? <span className="loader"></span> : 'Confirm Appointment'}
              </button>
            </form>
          </div>

          {/* Real-time History */}
          <div className="glass-card">
            <h2><span>📋</span> Patient History Logs</h2>
            {appointments.length === 0 ? (
               <div className="empty-state">No medical records found.</div>
            ) : (
              <ul className="appointment-list">
                {appointments.map(apt => (
                  <li key={apt.id} className={`appointment-item ${apt.status === 'Cancelled' ? 'cancelled' : ''}`}>
                    <div className="apt-info">
                      <div className="apt-header">
                        <h3>{apt.doctor.name}</h3>
                        <span className={`status-badge ${apt.status.toLowerCase()}`}>
                          {apt.status === 'Confirmed' ? '● Live' : '○ Void'}
                        </span>
                      </div>
                      <p className="apt-meta">{apt.doctor.specialty} • {apt.date} @ {apt.time}</p>
                    </div>
                    {apt.status === 'Confirmed' && (
                      <button className="cancel-btn" onClick={() => cancelAppointment(apt.id)} disabled={isLoading}>
                        Abort
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-wrapper">
      {/* 🚀 ULTIMATE PRO MAX CSS */}
      <style>
        {`
          :root { 
            --primary: #00f2fe; --secondary: #4facfe; --accent: #ff0844;
            --bg: #0b0f19; --text: #ffffff; --text-muted: #8b9bb4;
            --glass-bg: rgba(17, 25, 40, 0.75); --glass-border: rgba(255, 255, 255, 0.125);
          }
          
          body { 
            background-color: var(--bg);
            background-image: radial-gradient(circle at 15% 50%, rgba(79, 172, 254, 0.15), transparent 25%), 
                              radial-gradient(circle at 85% 30%, rgba(255, 8, 68, 0.1), transparent 25%);
            color: var(--text); font-family: 'Inter', system-ui, sans-serif; margin: 0; min-height: 100vh; overflow-x: hidden;
          }

          /* Global Animations */
          .fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          
          .app-container { max-width: 1200px; margin: 0 auto; padding: 30px 20px; }
          
          /* Holographic Navbar */
          .navbar { display: flex; justify-content: space-between; align-items: center; background: var(--glass-bg); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: 15px 30px; border-radius: 20px; border: 1px solid var(--glass-border); margin-bottom: 40px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); z-index: 100; position: sticky; top: 20px; }
          .logo { font-size: 1.5rem; font-weight: 800; margin: 0; background: linear-gradient(to right, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .nav-links { display: flex; gap: 10px; }
          .nav-btn { background: transparent; color: var(--text); border: 1px solid transparent; padding: 8px 16px; border-radius: 12px; cursor: pointer; font-weight: 600; transition: 0.3s; }
          .nav-btn:hover { background: rgba(255,255,255,0.1); border: 1px solid var(--glass-border); }
          .nav-btn.danger { color: #ff4b2b; } .nav-btn.danger:hover { background: rgba(255, 75, 43, 0.1); }

          /* Glassmorphism Cards */
          .glass-card { background: var(--glass-bg); backdrop-filter: blur(16px); border: 1px solid var(--glass-border); padding: 35px; border-radius: 24px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); position: relative; overflow: hidden; }
          .glass-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, var(--primary), transparent); }
          .glass-card h2 { margin-top: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--glass-border); padding-bottom: 15px; margin-bottom: 25px; }

          /* Dashboard Stats */
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
          .stat-card { background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 20px; border-radius: 20px; text-align: center; backdrop-filter: blur(10px); }
          .stat-card h3 { font-size: 2.5rem; margin: 0; background: linear-gradient(to right, #4facfe, #00f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .stat-card p { margin: 5px 0 0; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

          .grid-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; }
          
          /* Form Inputs */
          .form-group { display: flex; flex-direction: column; gap: 18px; }
          .row-group { display: flex; gap: 15px; } .row-group > * { flex: 1; }
          .glass-input { width: 100%; padding: 16px 20px; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); border-radius: 14px; color: white; font-size: 1rem; box-sizing: border-box; transition: 0.3s; outline: none; }
          .glass-input:focus { border-color: var(--primary); box-shadow: 0 0 15px rgba(0, 242, 254, 0.2); background: rgba(0,0,0,0.4); }
          .glass-input::placeholder { color: var(--text-muted); }
          select.glass-input option { background: var(--bg); color: white; }

          /* Buttons */
          .glow-button { background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%); color: #000; font-weight: 800; border: none; padding: 18px; border-radius: 14px; font-size: 1.1rem; cursor: pointer; transition: 0.3s; position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 20px rgba(0, 242, 254, 0.3); }
          .glow-button:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 25px rgba(0, 242, 254, 0.5); }
          .glow-button:disabled { opacity: 0.8; cursor: not-allowed; }
          .glass-button { background: rgba(255,255,255,0.05); color: white; border: 1px solid var(--glass-border); padding: 18px; border-radius: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; }
          .glass-button:hover { background: rgba(255,255,255,0.1); }

          /* Spinner */
          .loader { width: 22px; height: 22px; border: 3px solid rgba(0,0,0,0.3); border-bottom-color: #000; border-radius: 50%; display: inline-block; animation: rotation 1s linear infinite; }
          @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

          /* List & Badges */
          .appointment-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 15px; max-height: 400px; overflow-y: auto; padding-right: 10px; }
          .appointment-list::-webkit-scrollbar { width: 4px; } .appointment-list::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 10px; }
          
          .appointment-item { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); padding: 20px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; transition: 0.3s; }
          .appointment-item:hover { background: rgba(255,255,255,0.06); transform: translateX(5px); }
          .appointment-item.cancelled { opacity: 0.5; filter: grayscale(1); }
          
          .apt-header { display: flex; align-items: center; gap: 15px; margin-bottom: 5px; }
          .apt-header h3 { margin: 0; font-size: 1.2rem; }
          .status-badge { font-size: 0.75rem; padding: 4px 10px; border-radius: 20px; font-weight: 700; letter-spacing: 0.5px; }
          .status-badge.confirmed { background: rgba(0, 242, 254, 0.1); color: var(--primary); border: 1px solid rgba(0, 242, 254, 0.3); }
          .status-badge.cancelled { background: rgba(255, 8, 68, 0.1); color: var(--accent); border: 1px solid rgba(255, 8, 68, 0.3); }
          .apt-meta { margin: 0; color: var(--text-muted); font-size: 0.9rem; }
          
          .cancel-btn { background: rgba(255, 8, 68, 0.1); color: var(--accent); border: 1px solid rgba(255, 8, 68, 0.3); padding: 8px 16px; border-radius: 10px; cursor: pointer; font-weight: 600; transition: 0.3s; }
          .cancel-btn:hover { background: rgba(255, 8, 68, 0.2); }

          /* Profile Progress */
          .profile-completion { background: rgba(0,0,0,0.3); padding: 20px; border-radius: 16px; border: 1px solid var(--glass-border); }
          .progress-bar { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; margin-bottom: 8px; }
          .progress { height: 100%; background: linear-gradient(90deg, #4facfe, #00f2fe); transition: 1s ease-out; }

          /* Floating Toast System */
          .toast-container { position: fixed; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 9999; }
          .toast-popup { background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--primary); color: white; padding: 16px 24px; border-radius: 14px; font-weight: 600; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 30px rgba(0, 242, 254, 0.2); animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
          .empty-state { text-align: center; color: var(--text-muted); padding: 40px; border: 1px dashed var(--glass-border); border-radius: 16px; }
        `}
      </style>

      {/* Dynamic Toast Notifications */}
      <div className="toast-container">
        {notifications.map(n => (
          <div key={n.id} className="toast-popup">
            <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>⚡</span> {n.msg}
          </div>
        ))}
      </div>

      <div className="app-container">
        {/* Render Navbar only if Logged In */}
        {currentView !== 'auth' && (
          <nav className="navbar fade-in">
            <h1 className="logo">Aarogyam OS</h1>
            <div className="nav-links">
              <button className="nav-btn" onClick={() => setCurrentView('dashboard')}>Dashboard</button>
              <button className="nav-btn" onClick={() => setCurrentView('profile')}>Profile</button>
              <button className="nav-btn danger" onClick={() => { setCurrentView('auth'); setAuthMode('login'); }}>Disconnect</button>
            </div>
          </nav>
        )}

        {/* View Router */}
        {currentView === 'auth' && renderAuth()}
        {currentView === 'profile' && renderProfile()}
        {currentView === 'dashboard' && renderDashboard()}
      </div>
    </div>
  );
}

export default App;