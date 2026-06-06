export default function UserHeader({ user, handleLogout, wsStatus }) {
  return (
    <section className="panel user-header-panel">
      <div className="user-header-inline">
        <div>
          Logged in as <strong>{user.email}</strong> ({user.role})
        </div>
        <button type="button" className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className={`status-pill status-${wsStatus}`}>Telemetry: {wsStatus}</div>
    </section>
  );
}
