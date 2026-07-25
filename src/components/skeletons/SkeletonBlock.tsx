function SkeletonBlock({
  width = "100%",
  height = 16,
  radius = 4,
  style = {},
}: {
  width?: string | number;
  height?: string | number;
  radius?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="df-skeleton"
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}

export default SkeletonBlock;
