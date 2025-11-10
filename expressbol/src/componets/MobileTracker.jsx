export default function MobileTracker({ order, activeIndex, theme }) {
  const steps = order.length;
  const steplabelsbig = ['checked-in' , 'pkg-in-progress' , 'dock-assigned','sign-bol','admin-processing','checked-out' ]
const steplabelssmall = ['CI','PIP','DA','SB','AP','CO' ]

  // colors per state
  const colorFor = (i) =>
    i < activeIndex ? theme.done
    : i === activeIndex ? theme.primary
    : "#cfd4d9";

  return (
    <div className="mob-tracker" aria-label="Progress tracker">
      {/* Chevron strip */}
      <div className="chev-track">
        {order.map((_, i) => (
          <div
            key={i}
            className={`chev-seg ${i === 0 ? "first" : ""}`}
            style={{ "--seg": colorFor(i) }}
          >
            {/* <span style={{marginLeft : "16px", padding : "1px"
            }} />{steplabelssmall[i]} */}

          </div>
        ))}
      </div>

      {/* 1 / 2 / 3 / 4 line (keeps same width as track) */}
      <div className="mob-stepnums">
        {order.map((_, i) => (
            
          <span
            key={`n-${i}`}
            className={[
              "num",
              i < activeIndex ? "done" : "",
              i === activeIndex ? "on" : "",
            ].join(" ")}
          >
            {String(i + 1).padStart(2)}
          </span>
        ))}
      </div>
     
    </div>
  );
}
