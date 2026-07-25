import SkeletonBlock from "./SkeletonBlock";

function KpiCardSkeleton() {
  return (
    <div className="df-kpi-card">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <SkeletonBlock width={90} height={12} />
        <SkeletonBlock width={32} height={32} radius={8} />
      </div>
      <SkeletonBlock width={110} height={26} style={{ marginBottom: 8 }} />
      <SkeletonBlock width={130} height={11} />
    </div>
  );
}

export default KpiCardSkeleton;
