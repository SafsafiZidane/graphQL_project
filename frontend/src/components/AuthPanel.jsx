export default function AuthPanel({
  authMode,
  authInput,
  setAuthMode,
  setAuthInput,
  handleAuthSubmit,
}) {
  return (
    <section className="panel auth-panel auth-full">
      <div className="auth-header">
        <h2>{authMode === 'login' ? 'Login' : 'Register'}</h2>
        <div className="auth-switch">
          <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>
            Login
          </button>
          <button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>
            Register
          </button>
        </div>
      </div>

      <form onSubmit={handleAuthSubmit} className="form-grid">
        <label>
          Email
          <input
            type="email"
            value={authInput.email}
            onChange={(e) => setAuthInput((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={authInput.password}
            onChange={(e) => setAuthInput((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
        </label>

        {authMode === 'register' && (
          <label>
            Role
            <select value={authInput.role} onChange={(e) => setAuthInput((prev) => ({ ...prev, role: e.target.value }))}>
              <option value="OPERATOR">Operator</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
        )}

        <div className="form-actions">
          <button type="submit">{authMode === 'login' ? 'Login' : 'Register'}</button>
        </div>
      </form>
    </section>
  );
}
