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
import { useDashboard, useRevenueDaily } from "@/lib/hooks/use-analytics";
import KpiCardSkeleton from "@/components/skeletons/KpiCardSkeleton";
import ChartCardSkeleton from "@/components/skeletons/ChartCardSkeleton";

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useDashboard();
  const { data: revenue } = useRevenueDaily(30);

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
            color="#1D9E75"
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
            color="#3B82F6"
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
            color="#8B5CF6"
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
            color="#EF4444"
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
      </Row>
    </div>
  );
}
