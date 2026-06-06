export default function StatsGrid({ stats }) {
  return (
    <section className="panel grid-panel">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-title">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
