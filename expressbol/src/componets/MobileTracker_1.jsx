export default function MobileTracker({ order, labels, activeIndex, theme }) {
  const steps = order.length;
  const frac  = steps > 1 ? activeIndex / (steps - 1) : 1; // 0..1

  return (
    <div className="mob-tracker" aria-label="Progress tracker">
      {/* Track */}
      <div className="mob-track">
        {/* Filled */}
        <div
          className="mob-fill"
          style={{ transform: `scaleX(${Math.max(0, Math.min(1, frac))})`,
                   background: `linear-gradient(90deg, ${theme.done}, ${theme.primary})` }}
        />
        {/* Segments ticks */}
        {order.map((_, i) => (
          <span
            key={i}
            className="mob-tick"
            style={{ left: `${(i/(steps-1))*100}%`,
                     background: i <= activeIndex ? theme.done : "#cfd4d9" }}
          />
        ))}
        {/* Current marker (little chevron) */}
        <span
          className="mob-caret"
          style={{ left: `${frac*100}%`, borderLeftColor: theme.done }}
          aria-hidden
        />
      </div>

      {/* Stage badges below (scrollable on very small screens) */}
      {/* <div className="mob-labels" role="list">
        {order.map((s, i) => {
          const on = i <= activeIndex;
          return (
            <span
              role="listitem"
              key={s}
              className={`mob-badge ${on ? "on" : ""} ${i === activeIndex ? "current" : ""}`}
              style={{
                borderColor: on ? theme.done : "#d5d5d5",
                color: "#000",
                background: on ? "#f1f9e9" : "#fff",
              }}
            >
              {labels[s]}
            </span>
          );
        })}
      </div> */}
    </div>
  );
}

