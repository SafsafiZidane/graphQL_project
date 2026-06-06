export default function NotificationsPanel({ notifications, handleMarkNotificationRead }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Notifications</h2>
        <span className="panel-count">{notifications.length}</span>
      </div>
      <div className="list-box">
        {notifications.length === 0 ? (
          <div className="empty-state">No notifications yet.</div>
        ) : (
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li key={notification.id} className={notification.read ? 'notification-read' : 'notification-unread'}>
                <div>
                  <div className="notification-recipient">
                    <strong>{notification.recipient}</strong>
                    <span className="notification-status">{notification.read ? 'Read' : 'Unread'}</span>
                  </div>
                  <div>{notification.message}</div>
                </div>
                <button
                  type="button"
                  className="small-button"
                  disabled={notification.read}
                  onClick={() => handleMarkNotificationRead(notification.id)}
                >
                  {notification.read ? 'Already read' : 'Mark read'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
