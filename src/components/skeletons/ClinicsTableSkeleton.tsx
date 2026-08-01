import SkeletonBlock from "./SkeletonBlock";

export default function ClinicsTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="card">
      <div className="p-3 border-bottom">
        <SkeletonBlock width={140} height={16} />
      </div>

      <div className="p-3">
        <div className="d-flex gap-3 mb-3">
          <SkeletonBlock width="18%" height={13} />
          <SkeletonBlock width="16%" height={13} />
          <SkeletonBlock width="14%" height={13} />
          <SkeletonBlock width="12%" height={13} />
          <SkeletonBlock width="12%" height={13} />
        </div>

        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="d-flex align-items-center gap-3 py-3"
            style={{
              borderTop: index === 0 ? "none" : "1px solid var(--df-border)",
            }}
          >
            <SkeletonBlock width="18%" height={14} />
            <SkeletonBlock width="16%" height={14} />
            <SkeletonBlock width="14%" height={14} />
            <SkeletonBlock width="12%" height={24} radius={12} />
            <SkeletonBlock width="12%" height={14} />
          </div>
        ))}
      </div>
    </div>
  );
}
