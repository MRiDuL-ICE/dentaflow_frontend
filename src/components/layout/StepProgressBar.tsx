import { motion } from "framer-motion";

type Step = "email" | "clinic-select" | "password";

const STEP_LABELS: Record<Step, string> = {
  email: "Enter email",
  "clinic-select": "Select clinic",
  password: "Sign in",
};

interface StepProgressBarProps {
  current: Step;
  /** Whether the clinic-select step is part of this flow (multi-clinic accounts) */
  hasClinicStep?: boolean;
}

function StepProgressBar({
  current,
  hasClinicStep = false,
}: StepProgressBarProps) {
  const visibleSteps: Step[] = hasClinicStep
    ? ["email", "clinic-select", "password"]
    : ["email", "password"];

  const currentIndex = visibleSteps.indexOf(current);
  const total = visibleSteps.length;

  return (
    <div className="mb-4">
      {/* Step indicators */}
      <div className="d-flex align-items-center mb-2">
        {visibleSteps.map((step, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isLast = i === visibleSteps.length - 1;

          return (
            <div
              key={step}
              className="d-flex align-items-center"
              style={{ flex: isLast ? "0 0 auto" : "1 1 auto" }}
            >
              {/* Circle */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  background: isDone
                    ? "var(--df-primary)"
                    : isCurrent
                      ? "var(--df-bg, #fff)"
                      : "var(--df-border)",
                  color: isDone
                    ? "#fff"
                    : isCurrent
                      ? "var(--df-primary)"
                      : "var(--df-text-muted)",
                  border: isCurrent
                    ? "2px solid var(--df-primary)"
                    : "2px solid transparent",
                  transition: "all 0.3s ease",
                }}
              >
                {isDone ? "✓" : i + 1}
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    marginLeft: 4,
                    marginRight: 4,
                    background: "var(--df-border)",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      background: "var(--df-primary)",
                      borderRadius: 999,
                    }}
                    initial={false}
                    animate={{ width: isDone ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current step label — only the active one, so there's no ambiguity */}
      <div
        className="small text-center"
        style={{ color: "var(--df-primary)", fontWeight: 600, fontSize: 12 }}
      >
        Step {currentIndex + 1} of {total}: {STEP_LABELS[current]}
      </div>
    </div>
  );
}

export default StepProgressBar;
