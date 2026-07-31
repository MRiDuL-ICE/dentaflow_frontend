// components/AiInsightsSkeleton.tsx

export default function AiInsightsSkeleton() {
  return (
    <div style={{ padding: "20px" }}>
      {[55, 65, 75].map((titleWidth, i) => (
        <div
          key={i}
          style={{
            borderBottom: i < 2 ? "1px solid var(--df-border)" : "none",
            paddingBottom: i < 2 ? 16 : 0,
            marginBottom: i < 2 ? 16 : 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <div
              className="df-skeleton"
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                flexShrink: 0,
                marginTop: 2,
              }}
            />
            <div
              className="df-skeleton"
              style={{ height: 14, borderRadius: 4, width: `${titleWidth}%` }}
            />
          </div>

          <div
            style={{
              paddingLeft: 26,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: 12,
            }}
          >
            <div
              className="df-skeleton"
              style={{ height: 12, borderRadius: 4, width: "100%" }}
            />
            <div
              className="df-skeleton"
              style={{ height: 12, borderRadius: 4, width: "80%" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingLeft: 26,
              paddingTop: 10,
              borderTop: "1px solid var(--df-border)",
            }}
          >
            <div
              className="df-skeleton"
              style={{ height: 12, borderRadius: 4, width: 48, flexShrink: 0 }}
            />
            <div
              className="df-skeleton"
              style={{ height: 12, borderRadius: 4, width: "65%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
