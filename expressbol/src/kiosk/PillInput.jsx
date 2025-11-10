// /src/kiosk/PillInput.jsx
import { useState } from "react";

export default function PillInput({
  value = [],
  onChange = () => {},
  placeholder = "",
  inputClassName = "", // ✅ allows parent to pass theme classes (e.g., "control")
}) {
  const [txt, setTxt] = useState("");

  function add() {
    const v = txt.trim();
    if (!v) return;
    if (value.includes(v)) {
      setTxt("");
      return;
    }
    onChange([...value, v]);
    setTxt("");
  }

  function remove(id) {
    onChange(value.filter((x) => x !== id));
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={txt}
          className={`tf-input ${inputClassName}`.trim()} // ✅ now defined
          onChange={(e) => setTxt(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => (e.key === "Enter" ? add() : null)}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={add}
          style={btnSmall}
          className="pill-add" // ✅ so theme CSS can target it
        >
          Add
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {value.map((id) => (
          <span key={id} style={pill}>
            {id}
            <button type="button" onClick={() => remove(id)} style={pillClose}>
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

const btnSmall = {
  padding: "8px 12px",
  fontWeight: 700,
  borderRadius: 10,
  border: "1px solid #111",
  background: "#D7E83E",
  cursor: "pointer",
};

const pill = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 10px",
  background: "#fff",
  border: "1px solid #c9c9c9",
  borderRadius: 999,
};

const pillClose = {
  border: "none",
  background: "transparent",
  fontWeight: 900,
  cursor: "pointer",
};
