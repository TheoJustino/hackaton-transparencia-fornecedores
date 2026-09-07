function StatusBadge({ status }) {
  const statusClass = status.toLowerCase()

  return <span className={`status-badge status-${statusClass}`}>{status}</span>
}

export default StatusBadge
