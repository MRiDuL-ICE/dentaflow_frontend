import { FiGrid, FiList } from "react-icons/fi";

export type LayoutMode = "grid" | "list";

interface LayoutToggleProps {
  value: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

export function LayoutToggle({ value, onChange }: LayoutToggleProps) {
  return (
    <div
      style={{
        display: "flex",
        background: "var(--df-surface-alt, #F8FAFC)",
        border: "1px solid var(--df-border)",
        // borderRadius: 10,
        padding: 3,
        gap: 2,
      }}
    >
      {(["grid", "list"] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          title={mode === "grid" ? "Grid view" : "List view"}
          style={{
            width: 32,
            height: 32,
            // borderRadius: 7,
            border: "none",
            background: value === mode ? "#fff" : "transparent",
            boxShadow: value === mode ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            color:
              value === mode ? "var(--df-primary)" : "var(--df-text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
            fontSize: 15,
          }}
        >
          {mode === "grid" ? <FiGrid /> : <FiList />}
        </button>
      ))}
    </div>
  );
}
