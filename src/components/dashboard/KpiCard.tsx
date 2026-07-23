"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: ReactNode;
  color: string;
  delay?: number;
}

export function KpiCard({
  title,
  value,
  change,
  trend,
  icon,
  color,
  delay = 0,
}: KpiCardProps) {
  const trendColor =
    trend === "up"
      ? "#10B981"
      : trend === "down"
        ? "#EF4444"
        : "var(--df-text-muted)";

  return (
    <motion.div
      className="df-kpi-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="d-flex align-items-start justify-content-between">
        <div>
          <p
            className="small mb-1"
            style={{ color: "var(--df-text-secondary)" }}
          >
            {title}
          </p>
          <h3
            className="fw-bold mb-0"
            style={{ color: "var(--df-text-primary)", fontSize: 28 }}
          >
            {value}
          </h3>
          {change && (
            <span className="small" style={{ color: trendColor }}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {change}
            </span>
          )}
        </div>
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: color + "20",
            color,
            fontSize: 22,
          }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
