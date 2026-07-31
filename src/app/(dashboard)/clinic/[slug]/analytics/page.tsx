"use client";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Alert,
} from "reactstrap";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import {
  useDashboard,
  useRevenueDaily,
  usePatientGrowth,
  useAiInsights,
} from "@/lib/hooks/use-analytics";
import AiInsightsSkeleton from "./components/AiInsightsSkeleton";

const COLORS = ["#1D9E75", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444"];

interface ParsedInsight {
  title: string;
  insight: string;
  action: string;
}

function parseInsights(text: string): ParsedInsight[] {
  const items: ParsedInsight[] = [];
  const blocks = text.split(/\n(?=\d+\.\s)/);
  for (const block of blocks) {
    const titleMatch = block.match(/^\d+\.\s+\*\*(.+?)\*\*/);
    const insightMatch = block.match(
      /-\s+Insight:\s+(.+?)(?=\n-\s+Action:|$)/s,
    );
    const actionMatch = block.match(/-\s+Action:\s+(.+?)$/s);
    if (titleMatch) {
      items.push({
        title: titleMatch[1].trim(),
        insight: insightMatch ? insightMatch[1].trim().replace(/\n/g, " ") : "",
        action: actionMatch ? actionMatch[1].trim().replace(/\n/g, " ") : "",
      });
    }
  }
  return items;
}

export default function AnalyticsPage() {
  const { data: dashboard } = useDashboard();
  const { data: revenue } = useRevenueDaily(30);
  const { data: growth } = usePatientGrowth(12);
  const { data: insights, isLoading: insightsLoading } = useAiInsights();

  const revenueData =
    (revenue as any[])?.map((r: any) => ({
      date: new Date(r.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue: parseFloat(r.revenue ?? 0),
    })) ?? [];

  const growthData =
    (growth as any[])?.map((r: any) => ({
      week: new Date(r.week_start).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      new: parseInt(r.new_patients ?? 0),
      cumulative: parseInt(r.cumulative_total ?? 0),
    })) ?? [];

  const treatmentData =
    (dashboard?.charts?.treatmentBreakdown as any[])
      ?.slice(0, 5)
      .map((t: any) => ({
        name: t.treatment_type,
        value: parseInt(t.count),
      })) ?? [];

  const parsedInsights = insights?.insights
    ? parseInsights(insights.insights)
    : [];

  return (
    <div className="df-fade-in">
      <div className="mb-4">
        <h4 className="fw-bold mb-0">Analytics</h4>
        <p className="small mb-0" style={{ color: "var(--df-text-secondary)" }}>
          Clinic performance insights
        </p>
      </div>

      <Row className="g-3">
        {/* Revenue trend */}
        <Col xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader
                style={{
                  background: "transparent",
                  borderBottom: "1px solid var(--df-border)",
                  fontWeight: 600,
                }}
              >
                Revenue Trend (30 Days)
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={revenueData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--df-border)"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "var(--df-text-muted)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--df-text-muted)" }}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                      formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]}
                      contentStyle={{
                        background: "var(--df-bg-card)",
                        border: "1px solid var(--df-border)",
                        borderRadius: 8,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1D9E75"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </motion.div>
        </Col>

        {/* Treatment breakdown */}
        <Col xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader
                style={{
                  background: "transparent",
                  borderBottom: "1px solid var(--df-border)",
                  fontWeight: 600,
                }}
              >
                Top Treatments
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={treatmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {treatmentData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--df-bg-card)",
                        border: "1px solid var(--df-border)",
                        borderRadius: 8,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </motion.div>
        </Col>

        {/* Patient growth */}
        <Col xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader
                style={{
                  background: "transparent",
                  borderBottom: "1px solid var(--df-border)",
                  fontWeight: 600,
                }}
              >
                Patient Growth (12 Weeks)
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={growthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--df-border)"
                    />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 11, fill: "var(--df-text-muted)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--df-text-muted)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--df-bg-card)",
                        border: "1px solid var(--df-border)",
                        borderRadius: 8,
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="new"
                      name="New Patients"
                      fill="#1D9E75"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="cumulative"
                      name="Total"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </motion.div>
        </Col>

        {/* AI Insights */}
        <Col xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader
                style={{
                  background: "transparent",
                  borderBottom: "1px solid var(--df-border)",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>AI Insights</span>
                {!insightsLoading && parsedInsights.length > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#1D9E75",
                      background: "rgba(29,158,117,0.08)",
                      border: "1px solid rgba(29,158,117,0.2)",
                      borderRadius: 20,
                      padding: "2px 10px",
                    }}
                  >
                    {parsedInsights.length} insights
                  </span>
                )}
              </CardHeader>
              <CardBody style={{ padding: 0 }}>
                {insightsLoading ? (
                  <AiInsightsSkeleton />
                ) : parsedInsights.length > 0 ? (
                  <div>
                    {parsedInsights.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          borderBottom:
                            i < parsedInsights.length - 1
                              ? "1px solid var(--df-border)"
                              : "none",
                        }}
                      >
                        {/* Title row */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                            padding: "16px 20px 10px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "var(--df-text-muted)",
                              minWidth: 18,
                              paddingTop: 2,
                              flexShrink: 0,
                            }}
                          >
                            {i + 1}
                          </span>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "var(--df-text-primary)",
                              lineHeight: 1.4,
                            }}
                          >
                            {item.title}
                          </span>
                        </div>

                        {/* Insight text */}
                        {item.insight && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              color: "var(--df-text-secondary)",
                              lineHeight: 1.65,
                              padding: "0 20px 12px 50px",
                            }}
                          >
                            {item.insight}
                          </p>
                        )}

                        {/* Action row */}
                        {item.action && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 8,
                              padding: "10px 20px 16px 50px",
                              borderTop: "1px solid var(--df-border)",
                              background: "rgba(29,158,117,0.04)",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#1D9E75",
                                whiteSpace: "nowrap",
                                paddingTop: 2,
                                flexShrink: 0,
                              }}
                            >
                              → Action
                            </span>
                            <span
                              style={{
                                fontSize: 13,
                                color: "var(--df-text-secondary)",
                                lineHeight: 1.65,
                              }}
                            >
                              {item.action}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2.5rem",
                      color: "var(--df-text-muted)",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 500,
                        fontSize: 14,
                        color: "var(--df-text-primary)",
                        margin: "0 0 4px",
                      }}
                    >
                      Not enough data yet
                    </p>
                    <p style={{ fontSize: 12, margin: 0 }}>
                      Insights will appear once your clinic has more activity.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}
