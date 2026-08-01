import SkeletonBlock from "@/components/skeletons/SkeletonBlock";

export function PatientRowSkeleton() {
  return (
    <tr>
      <td className="align-middle">
        <SkeletonBlock width={140} height={13} style={{ marginBottom: 6 }} />
        <SkeletonBlock width={170} height={11} />
      </td>
      <td className="align-middle">
        <SkeletonBlock width={100} height={13} />
      </td>
      <td className="align-middle">
        <SkeletonBlock width={80} height={13} />
      </td>
      <td className="align-middle">
        <SkeletonBlock width={60} height={20} radius={12} />
      </td>
      <td className="align-middle">
        <div className="d-flex gap-2">
          <SkeletonBlock width={32} height={28} radius={6} />
          <SkeletonBlock width={32} height={28} radius={6} />
          <SkeletonBlock width={32} height={28} radius={6} />
        </div>
      </td>
    </tr>
  );
}
