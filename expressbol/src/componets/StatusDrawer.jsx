export default function StatusDrawer({ open, onClose, status, order, labels, activeIndex }) {
  const progress = order.length > 1 ? activeIndex / (order.length - 1) : 1;

  return (
    <>
      {open ? <div className="drawer-backdrop" onClick={onClose} /> : null}

      <aside className={`drawer ${open ? "drawer--open" : ""}`} aria-live="polite">
        <div className="panel">
          <div className="drawer-h">
            <span>{labels[status]}</span>
            <button className="close" onClick={onClose} aria-label="Close">×</button>
          </div>

          <div className="timeline" style={{ "--prog": progress}}>
            {order.map((step, idx) => (
              <div
                key={step}
                style={{minHeight: "12dvh"}}
                className={`tl-step ${idx <= activeIndex ? "done" : ""} ${idx === activeIndex ? "current" : ""}`}
              >
                <span className="tl-bullet" />
                <span className="tl-label">{labels[step]}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
