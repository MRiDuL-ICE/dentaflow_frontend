import { motion } from "framer-motion";

type Step = 1 | 2 | 3 | 4;

const STEP_CONFIG: Record<Step, { label: string; description: string }> = {
  1: { label: "Basic Info", description: "Personal details" },
  2: { label: "Medical History", description: "Allergies & conditions" },
  3: { label: "Insurance", description: "Coverage details" },
  4: { label: "Emergency Contact", description: "In case of emergency" },
};
export default function WizardSteps({ current }: { current: Step }) {
  const steps = [1, 2, 3, 4] as Step[];

  return (
    <div style={{ position: "relative", marginBottom: "1.5rem" }}>
      {/* Full background track */}
      <div
        style={{
          position: "absolute",
          top: 14, // half of circle height (28/2)
          left: "12.5%", // center of first step
          right: "12.5%", // center of last step
          height: 2,
          background: "var(--df-border)",
          zIndex: 0,
        }}
      />
      {/* Filled progress track */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: "12.5%",
          width: `${((current - 1) / (steps.length - 1)) * 75}%`,
          height: 2,
          background: "#1D9E75",
          transition: "width 0.3s ease",
          zIndex: 0,
        }}
      />

      {/* Steps row */}
      <div
        className="d-flex justify-content-around"
        style={{ position: "relative", zIndex: 1 }}
      >
        {steps.map((s) => (
          <div
            key={s}
            className="d-flex flex-column align-items-center"
            style={{ width: 70 }}
          >
            <motion.div
              animate={{
                background: current >= s ? "#1D9E75" : "var(--df-border)",
                scale: current === s ? 1.1 : 1,
              }}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: current >= s ? "#fff" : "var(--df-text-muted)",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {current > s ? "✓" : s}
            </motion.div>
            <span
              className="mt-1 text-center"
              style={{
                fontSize: 10,
                color:
                  current >= s ? "var(--df-primary)" : "var(--df-text-muted)",
                fontWeight: current === s ? 600 : 400,
                lineHeight: 1.2,
              }}
            >
              {STEP_CONFIG[s].label}
            </span>
            <span
              style={{
                fontSize: 9,
                color: "var(--df-text-muted)",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              ({STEP_CONFIG[s].description})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
