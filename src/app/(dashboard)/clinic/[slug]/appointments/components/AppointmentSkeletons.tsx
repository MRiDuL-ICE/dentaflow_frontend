import { Col, Row } from "reactstrap";

function SkeletonPulse({
  width = "100%",
  height = 14,
  className = "",
}: {
  width?: string | number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`df-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: "var(--df-radius-md)",
      }}
    />
  );
}

function GridCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--df-bg-card)",
        border: "1px solid var(--df-border)",
        borderRadius: "var(--df-radius-lg)",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <SkeletonPulse width={80} height={22} />
        <SkeletonPulse width={60} height={13} />
      </div>
      <SkeletonPulse width="70%" height={16} />
      <div className="d-flex flex-column gap-2">
        <SkeletonPulse width="50%" height={13} />
        <SkeletonPulse width="40%" height={13} />
      </div>
      <div className="d-flex justify-content-end">
        <SkeletonPulse width={110} height={30} />
      </div>
    </div>
  );
}

function ListRowSkeleton() {
  return (
    <div
      style={{
        background: "var(--df-bg-card)",
        border: "1px solid var(--df-border)",
        borderRadius: "var(--df-radius-lg)",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <SkeletonPulse width={80} height={22} />
      <SkeletonPulse width={160} height={14} />
      <SkeletonPulse width={90} height={13} className="ms-auto" />
      <SkeletonPulse width={70} height={13} />
      <SkeletonPulse width={110} height={30} />
    </div>
  );
}

export function GridSkeletons({ count = 6 }: { count?: number }) {
  return (
    <Row className="g-3">
      {Array.from({ length: count }).map((_, i) => (
        <Col key={i} xs={12} md={6} xl={4}>
          <GridCardSkeleton />
        </Col>
      ))}
    </Row>
  );
}

export function ListSkeletons({ count = 6 }: { count?: number }) {
  return (
    <div className="d-flex flex-column gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <ListRowSkeleton key={i} />
      ))}
    </div>
  );
}
