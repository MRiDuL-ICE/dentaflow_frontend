"use client";

import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiAlertCircle,
} from "react-icons/fi";
import { KpiCard } from "@/components/dashboard/KpiCard";
import {
  useAiInsights,
  useDashboard,
  useRevenueDaily,
} from "@/lib/hooks/use-analytics";
import KpiCardSkeleton from "@/components/skeletons/KpiCardSkeleton";
import ChartCardSkeleton from "@/components/skeletons/ChartCardSkeleton";
import AiInsightsSkeleton from "../analytics/components/AiInsightsSkeleton";

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

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useDashboard();
  const { data: revenue } = useRevenueDaily(30);
  const { data: insights, isLoading: insightsLoading } = useAiInsights();

  if (isLoading) {
    return (
      <div className="df-fade-in">
        <Row className="g-3 mb-4">
          {[0, 1, 2, 3].map((i) => (
            <Col xs={12} sm={6} xl={3} key={i}>
              <KpiCardSkeleton />
            </Col>
          ))}
        </Row>
        <Row className="g-3 mb-4">
          <Col xs={12} lg={8}>
            <ChartCardSkeleton titleWidth={180} />
          </Col>
          <Col xs={12} lg={4}>
            <ChartCardSkeleton titleWidth={150} />
          </Col>
          <Col
            xs={12}
            style={{
              border: "1px solid var(--df-border)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderRadius: "var(--df-radius-lg)",
            }}
          >
            <AiInsightsSkeleton />
          </Col>
        </Row>
      </div>
    );
  }

  const kpis = dashboard?.kpis ?? {};
  const revenueData =
    (revenue as any[])?.map((r: any) => ({
      date: new Date(r.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue: parseFloat(r.revenue ?? 0),
      count: parseInt(r.invoice_count ?? 0),
    })) ?? [];

  const apptData =
    (dashboard?.charts?.appointmentStats as any[])
      ?.slice(-14)
      .map((r: any) => ({
        date: new Date(r.date).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        completed: r.completed,
        cancelled: r.cancelled,
        no_show: r.no_show,
      })) ?? [];

  const parsedInsights = insights?.insights
    ? parseInsights(insights.insights)
    : [];

  return (
    <div className="df-fade-in">
      {/* KPI Cards */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} xl={3}>
          <KpiCard
            title="Revenue (30d)"
            value={`$${parseFloat(kpis?.revenue?.total_revenue_30d ?? 0).toFixed(0)}`}
            change="vs last month"
            trend="up"
            icon={<FiDollarSign />}
            baseColor="#14a44d"
            accentColor="#1ac75e"
            delay={0}
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <KpiCard
            title="Appointments (30d)"
            value={kpis?.appointments?.total_30d ?? 0}
            change={`${kpis?.appointments?.upcoming_7d ?? 0} upcoming`}
            trend="neutral"
            icon={<FiCalendar />}
            baseColor="#1565c0"
            accentColor="#2196f3"
            delay={0.1}
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <KpiCard
            title="Total Patients"
            value={kpis?.patients?.total_active ?? 0}
            change={`+${kpis?.patients?.new_30d ?? 0} this month`}
            trend="up"
            icon={<FiUsers />}
            baseColor="#6a1b9a"
            accentColor="#ab47bc"
            delay={0.2}
          />
        </Col>
        <Col xs={12} sm={6} xl={3}>
          <KpiCard
            title="Overdue Invoices"
            value={kpis?.billing?.overdue_invoices ?? 0}
            trend={
              (kpis?.billing?.overdue_invoices ?? 0) > 0 ? "down" : "neutral"
            }
            change={`+${kpis?.billing?.new_30d ?? 0} this month`}
            icon={<FiAlertCircle />}
            baseColor="#b71c1c"
            accentColor="#ef5350"
            delay={0.3}
          />
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-3 mb-4">
        {/* Revenue chart */}
        <Col xs={12} lg={8}>
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
                }}
              >
                Revenue — Last 30 Days
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#1D9E75"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#1D9E75"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
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
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1D9E75"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </motion.div>
        </Col>

        {/* Appointments chart */}
        <Col xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader
                style={{
                  background: "transparent",
                  borderBottom: "1px solid var(--df-border)",
                  fontWeight: 600,
                }}
              >
                Appointments — 14 Days
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={apptData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--df-border)"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "var(--df-text-muted)" }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--df-text-muted)" }}
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
                      dataKey="completed"
                      fill="#1D9E75"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="cancelled"
                      fill="#EF4444"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="no_show"
                      fill="#F59E0B"
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
