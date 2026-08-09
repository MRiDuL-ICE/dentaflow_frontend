"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { clinicSettingsApi } from "@/lib/api/endpoints/clinic-settings";
import { staffApi } from "@/lib/api/endpoints/staff";
import { treatmentsApi } from "@/lib/api/endpoints/treatments";
import { useAuthStore } from "@/lib/store/auth.store";
import { useThemeStore } from "@/lib/store/theme.store";

import { AddStaffModal } from "./_components/AddStaffModal";
import { StaffSection } from "./_sections/Staffsection";
import { ClinicalSection } from "./_sections/Clinicalsection";
import { NotificationsSection } from "./_sections/Notificationssection";
import { AppointmentsSection } from "./_sections/Appointmentssection";
import { AppearanceSection } from "./_sections/Appearancesection";
import { DangerSection } from "./_sections/Dangersection";
import styles from "./page.module.css";

type Section =
  | "staff"
  | "clinical"
  | "notifications"
  | "appointments"
  | "appearance"
  | "danger";

export type StaffMember = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  joined_at: string;
};
export type Category = {
  id: string;
  name: string;
  color: string;
  is_active: boolean;
};
export type Treatment = {
  id: string;
  name: string;
  base_cost: number;
  duration_minutes: number;
  category_name: string;
};
export type Settings = {
  notify_email: boolean;
  notify_sms: boolean;
  notify_appointment_reminder: boolean;
  notify_appointment_confirm: boolean;
  notify_billing: boolean;
  appearance_theme: "light" | "dark" | "system";
  appearance_language: string;
  appt_default_duration: number;
  appt_slot_interval: number;
  appt_start_time: string;
  appt_end_time: string;
};

type TabDef = {
  id: Section;
  label: string;
  icon: string;
  danger?: boolean;
  groupEnd?: boolean; // renders a separator after this tab
};

const TABS: TabDef[] = [
  { id: "staff", label: "Staff", icon: "ti-users", groupEnd: true },
  { id: "clinical", label: "Clinical", icon: "ti-tooth" },
  { id: "notifications", label: "Notifications", icon: "ti-bell" },
  { id: "appointments", label: "Appointments", icon: "ti-calendar" },
  // { id: "appearance", label: "Appearance", icon: "ti-palette", groupEnd: true },
  {
    id: "danger",
    label: "Danger zone",
    icon: "ti-alert-triangle",
    danger: true,
  },
];

export default function SettingsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { hasRole } = useAuthStore();
  const { setTheme } = useThemeStore();
  const isOwner = hasRole("clinic_owner");

  const [activeSection, setActiveSection] = useState<Section>("staff");
  const [addStaffOpen, setAddStaffOpen] = useState(false);

  // ── Staff ──
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staffErr, setStaffErr] = useState("");

  // ── Clinical ──
  const [categories, setCategories] = useState<Category[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [clinicalLoading, setClinicalLoading] = useState(true);
  const [clinicalErr, setClinicalErr] = useState("");

  // ── Settings ──
  const [settings, setSettings] = useState<Settings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsErr, setSettingsErr] = useState("");

  const loadStaff = useCallback(async () => {
    setStaffLoading(true);
    setStaffErr("");
    try {
      const res = await staffApi.getAll();
      setStaff(res.data);
    } catch {
      setStaffErr("Could not load staff.");
    } finally {
      setStaffLoading(false);
    }
  }, []);

  const loadClinical = useCallback(async () => {
    setClinicalLoading(true);
    setClinicalErr("");
    try {
      const [catRes, treatRes] = await Promise.all([
        treatmentsApi.getCategories(),
        treatmentsApi.getCatalog(),
      ]);
      setCategories(catRes.data);
      setTreatments(treatRes.data);
    } catch {
      setClinicalErr("Could not load clinical data.");
    } finally {
      setClinicalLoading(false);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    setSettingsLoading(true);
    setSettingsErr("");
    try {
      const res = await clinicSettingsApi.get();
      setSettings(res.data);
    } catch {
      setSettingsErr("Could not load settings.");
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);
  useEffect(() => {
    if (activeSection === "clinical" && clinicalLoading) loadClinical();
  }, [activeSection]);
  useEffect(() => {
    if (
      ["notifications", "appointments", "appearance"].includes(activeSection) &&
      settingsLoading
    )
      loadSettings();
  }, [activeSection]);

  const visibleTabs = TABS.filter((t) => t.id !== "danger" || isOwner);

  return (
    <>
      <AddStaffModal
        isOpen={addStaffOpen}
        onClose={() => setAddStaffOpen(false)}
        onSuccess={loadStaff}
      />

      {/* ── Page header ── */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Settings</h4>
        <p className="small mb-0" style={{ color: "var(--df-text-secondary)" }}>
          Manage your clinic configuration
        </p>
      </div>

      {/* ── Tab bar ── */}
      <div className={styles.tabBar} role="tablist">
        {visibleTabs.map((tab, i) => {
          const active = activeSection === tab.id;
          return (
            <>
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActiveSection(tab.id)}
                className={[
                  styles.tab,
                  active ? styles.tabActive : "",
                  tab.danger ? styles.tabDanger : "",
                  active && tab.danger ? styles.tabDangerActive : "",
                ].join(" ")}
              >
                <i className={`ti ${tab.icon}`} aria-hidden="true" />
                {tab.label}
              </button>
              {tab.groupEnd && i < visibleTabs.length - 1 && (
                <span
                  key={`sep-${tab.id}`}
                  className={styles.sep}
                  aria-hidden="true"
                />
              )}
            </>
          );
        })}
      </div>

      {/* ── Content panel ── */}
      <div
        className={styles.panel}
        role="tabpanel"
        id={`panel-${activeSection}`}
      >
        {activeSection === "staff" && (
          <StaffSection
            staff={staff?.data}
            loading={staffLoading}
            error={staffErr}
            isOwner={isOwner}
            onAddStaff={() => setAddStaffOpen(true)}
          />
        )}
        {activeSection === "clinical" && (
          <ClinicalSection
            categories={categories}
            treatments={treatments}
            loading={clinicalLoading}
            error={clinicalErr}
            isOwner={isOwner}
            onReload={loadClinical}
          />
        )}
        {activeSection === "notifications" && (
          <NotificationsSection
            settings={settings}
            loading={settingsLoading}
            error={settingsErr}
            isOwner={isOwner}
            onSettingToggle={async (key, value) => {
              if (!settings) return;
              setSettings({ ...settings, [key]: value });
              try {
                await clinicSettingsApi.update({ [key]: value });
              } catch {
                loadSettings();
              }
            }}
          />
        )}
        {activeSection === "appointments" && (
          <AppointmentsSection
            settings={settings}
            loading={settingsLoading}
            error={settingsErr}
            isOwner={isOwner}
            onChange={(updated) => setSettings(updated)}
            onSave={async (s) => {
              await clinicSettingsApi.update({
                apptDefaultDuration: s.appt_default_duration,
                apptSlotInterval: s.appt_slot_interval,
                apptStartTime: s.appt_start_time,
                apptEndTime: s.appt_end_time,
              });
            }}
          />
        )}
        {activeSection === "appearance" && (
          <AppearanceSection
            settings={settings}
            loading={settingsLoading}
            error={settingsErr}
            isOwner={isOwner}
            onSettingChange={async (key, value) => {
              if (!settings) return;
              setSettings({ ...settings, [key]: value });
              try {
                await clinicSettingsApi.update({ [key]: value });
                if (key === "appearance_theme" && value !== "system") {
                  setTheme(value as "light" | "dark");
                }
              } catch {
                loadSettings();
              }
            }}
          />
        )}
        {activeSection === "danger" && isOwner && <DangerSection slug={slug} />}
      </div>
    </>
  );
}
