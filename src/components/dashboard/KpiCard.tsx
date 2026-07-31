"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: ReactNode;
  baseColor: string; // darker half, e.g. "#14a44d"
  accentColor: string; // lighter half, e.g. "#1ac75e"
  delay?: number;
}

export function KpiCard({
  title,
  value,
  change,
  trend,
  icon,
  baseColor,
  accentColor,
  delay = 0,
}: KpiCardProps) {
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <motion.div
      style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        padding: "20px 18px",
        minHeight: 110,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      {/* Base (darker) half */}
      <div style={{ position: "absolute", inset: 0, background: baseColor }} />

      {/* Accent (lighter) half — diagonal clip */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: accentColor,
          clipPath: "polygon(45% 0%, 100% 0%, 100% 100%, 30% 100%)",
        }}
      />

      {/* Icon */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 18,
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          color: "#fff",
          zIndex: 1,
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.75)",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {title}
        </p>
        <h3
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1,
            marginBottom: 6,
          }}
        >
          {value}
        </h3>
        {change && (
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
            {trendIcon} {change}
          </span>
        )}
      </div>
    </motion.div>
  );
}
