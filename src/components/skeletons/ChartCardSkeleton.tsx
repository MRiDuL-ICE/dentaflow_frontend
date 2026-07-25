import { Card, CardHeader, CardBody } from "reactstrap";
import SkeletonBlock from "./SkeletonBlock";

function ChartCardSkeleton({ titleWidth = 160 }: { titleWidth?: number }) {
  return (
    <Card>
      <CardHeader
        style={{
          background: "transparent",
          borderBottom: "1px solid var(--df-border)",
        }}
      >
        <SkeletonBlock width={titleWidth} height={14} />
      </CardHeader>
      <CardBody>
        <div className="d-flex align-items-end" style={{ height: 250, gap: 8 }}>
          {[65, 40, 80, 55, 90, 45, 70, 60, 85, 50, 75, 40].map((h, i) => (
            <SkeletonBlock
              key={i}
              width="100%"
              height={`${h}%`}
              radius={4}
              style={{ flex: 1 }}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default ChartCardSkeleton;
