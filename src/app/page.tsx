// import { redirect } from "next/navigation";

// export default function HomePage() {
//   redirect("/login");
// }

// export const metadata = {
//   title: "DentaFlow",
//   description: "Intelligent multi-tenant dental clinic management platform",
// };

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Button } from "reactstrap";
import {
  FiUsers,
  FiCalendar,
  FiActivity,
  FiDollarSign,
  FiMail,
  FiBarChart2,
  FiArrowRight,
  FiMenu,
  FiX,
} from "react-icons/fi";

// ── Language helpers ──────────────────────────────────────────────────────────
type Lang = "en" | "bn";
function T({ en, bn, lang }: { en: string; bn: string; lang: Lang }) {
  return <>{lang === "bn" ? bn : en}</>;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <FiUsers />,
    en: {
      title: "Patient Records",
      desc: "Complete medical history, allergies, insurance and emergency contacts — all searchable in seconds.",
    },
    bn: {
      title: "রোগীর রেকর্ড",
      desc: "সম্পূর্ণ মেডিকেল ইতিহাস, অ্যালার্জি, বিমা ও জরুরি যোগাযোগ — সেকেন্ডে খুঁজে পান।",
    },
  },
  {
    icon: <FiCalendar />,
    en: {
      title: "Smart Scheduling",
      desc: "Book, reschedule and manage appointments across multiple dentists and chairs — no double-bookings ever.",
    },
    bn: {
      title: "স্মার্ট শিডিউলিং",
      desc: "একাধিক ডেন্টিস্ট ও চেয়ারে অ্যাপয়েন্টমেন্ট বুক ও পরিচালনা করুন — ডাবল বুকিং কখনো না।",
    },
  },
  {
    icon: <FiActivity />,
    en: {
      title: "Chair & Room Management",
      desc: "See every chair's live status at a glance. Assign patients automatically or override manually.",
    },
    bn: {
      title: "চেয়ার ও রুম ম্যানেজমেন্ট",
      desc: "এক নজরে প্রতিটি চেয়ারের লাইভ স্ট্যাটাস দেখুন। স্বয়ংক্রিয়ভাবে বা ম্যানুয়ালি রোগী নির্ধারণ করুন।",
    },
  },
  {
    icon: <FiDollarSign />,
    en: {
      title: "Billing & Invoicing",
      desc: "Generate itemised invoices per visit, track payment status and keep your revenue organised.",
    },
    bn: {
      title: "বিলিং ও ইনভয়েসিং",
      desc: "প্রতিটি ভিজিটের জন্য বিস্তারিত ইনভয়েস তৈরি করুন এবং পেমেন্ট স্ট্যাটাস ট্র্যাক করুন।",
    },
  },
  {
    icon: <FiMail />,
    en: {
      title: "Automated Reminders",
      desc: "SMS and email reminders reduce no-shows and keep patients arriving on schedule, automatically.",
    },
    bn: {
      title: "স্বয়ংক্রিয় রিমাইন্ডার",
      desc: "এসএমএস ও ইমেইল রিমাইন্ডার স্বয়ংক্রিয়ভাবে নো-শো কমিয়ে আনে।",
    },
  },
  {
    icon: <FiBarChart2 />,
    en: {
      title: "Dashboard & Reports",
      desc: "Daily, weekly and monthly snapshots of revenue, patient flow and treatment trends — no spreadsheets needed.",
    },
    bn: {
      title: "ড্যাশবোর্ড ও রিপোর্ট",
      desc: "রাজস্ব, রোগীর প্রবাহ ও চিকিৎসার প্রবণতার দৈনিক, সাপ্তাহিক ও মাসিক রিপোর্ট।",
    },
  },
];

const STEPS = [
  {
    en: {
      title: "Create your clinic profile",
      desc: "Enter your clinic name, address and working hours. Add dentists and chairs — takes about 3 minutes.",
    },
    bn: {
      title: "আপনার ক্লিনিকের প্রোফাইল তৈরি করুন",
      desc: "ক্লিনিকের নাম, ঠিকানা ও কর্মঘণ্টা দিন। ডেন্টিস্ট ও চেয়ার যোগ করুন — মাত্র ৩ মিনিট।",
    },
  },
  {
    en: {
      title: "Import or add your patients",
      desc: "Add patients one by one or bulk-import from a CSV. Medical history and insurance captured from day one.",
    },
    bn: {
      title: "রোগী যোগ করুন বা আমদানি করুন",
      desc: "একে একে বা CSV দিয়ে বাল্ক আমদানি করুন। মেডিকেল ইতিহাস প্রথম দিন থেকেই সংরক্ষিত হয়।",
    },
  },
  {
    en: {
      title: "Book your first appointment",
      desc: "Pick a patient, dentist, treatment type and time slot. DentFlow checks for conflicts and assigns a chair.",
    },
    bn: {
      title: "প্রথম অ্যাপয়েন্টমেন্ট বুক করুন",
      desc: "রোগী, ডেন্টিস্ট, চিকিৎসার ধরন ও সময় বেছে নিন। DentFlow স্বয়ংক্রিয়ভাবে চেয়ার নির্ধারণ করে।",
    },
  },
  {
    en: {
      title: "DentFlow handles the rest",
      desc: "Reminders go out automatically, invoices are generated after each visit, and your dashboard updates in real time.",
    },
    bn: {
      title: "বাকিটা DentFlow সামলায়",
      desc: "রিমাইন্ডার স্বয়ংক্রিয়ভাবে যায়, ইনভয়েস তৈরি হয়, ড্যাশবোর্ড রিয়েল টাইমে আপডেট হয়।",
    },
  },
];

const PREVIEW_PATIENTS = [
  {
    initials: "RK",
    name: "Rahim Khan",
    meta: "10:00 AM · Root Canal · Dr. Sultana",
    statusEn: "Confirmed",
    statusBn: "নিশ্চিত",
    color: "#dcfce7",
    text: "#15803d",
  },
  {
    initials: "FA",
    name: "Fatima Ahmed",
    meta: "11:30 AM · Scaling · Dr. Islam",
    statusEn: "Pending",
    statusBn: "অপেক্ষমাণ",
    color: "#fef9c3",
    text: "#854d0e",
  },
  {
    initials: "MH",
    name: "Masud Hossain",
    meta: "09:00 AM · Extraction · Dr. Sultana",
    statusEn: "Done",
    statusBn: "সম্পন্ন",
    color: "#e6ebf5",
    text: "#002972",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [mobileNav, setMobileNav] = useState(false);

  // persist language
  useEffect(() => {
    const saved = localStorage.getItem("df-lang") as Lang | null;
    if (saved) setLang(saved);
  }, []);
  function switchLang(l: Lang) {
    setLang(l);
    localStorage.setItem("df-lang", l);
  }

  // scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("lp-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".lp-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ── NAV ── */}
      <nav className="lp-nav">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 1160,
            margin: "0 auto",
            padding: "0 24px",
            gap: 16,
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <Image
              src="/logo.png"
              alt="DentFlow"
              width={80}
              height={80}
              style={{ width: 80, height: 80 }}
            />
          </Link>

          {/* Desktop links */}
          <ul className="d-none d-md-flex align-items-center gap-4 mb-0 list-unstyled">
            {[
              { href: "#features", en: "Features", bn: "ফিচার" },
              {
                href: "#how-it-works",
                en: "How it works",
                bn: "কীভাবে কাজ করে",
              },
              { href: "#contact", en: "Contact", bn: "যোগাযোগ" },
            ].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--df-text-secondary)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--df-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--df-text-secondary)")
                  }
                >
                  <T en={l.en} bn={l.bn} lang={lang} />
                </a>
              </li>
            ))}
          </ul>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div className="lang-pill">
              <button
                className={lang === "en" ? "active" : ""}
                onClick={() => switchLang("en")}
              >
                EN
              </button>
              <button
                className={lang === "bn" ? "active" : ""}
                onClick={() => switchLang("bn")}
              >
                বাং
              </button>
            </div>
            <Link
              href="/login"
              className="lp-btn-outline lp-btn-sm d-none d-md-inline-flex"
            >
              <T en="Log in" bn="লগ ইন" lang={lang} />
            </Link>
            <Link
              href="/clinic/register"
              className="lp-btn-primary lp-btn-sm d-none d-md-inline-flex"
            >
              <T en="Get started free" bn="বিনামূল্যে শুরু করুন" lang={lang} />
            </Link>
            {/* Hamburger */}
            <button
              className="d-flex d-md-none df-icon-btn"
              onClick={() => setMobileNav(true)}
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {mobileNav && (
        <div className="lp-mobile-nav">
          <div
            className="lp-mobile-backdrop"
            onClick={() => setMobileNav(false)}
          />
          <div className="lp-mobile-drawer">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Link href="/" style={{ textDecoration: "none" }}>
                <Image
                  src="/logo.png"
                  alt="DentFlow"
                  width={80}
                  height={80}
                  style={{ width: 80, height: 80 }}
                />
              </Link>
              <button
                className="df-icon-btn"
                onClick={() => setMobileNav(false)}
                aria-label="Close menu"
              >
                <FiX size={20} />
              </button>
            </div>
            <hr style={{ borderColor: "var(--df-border)" }} />
            {[
              { href: "#features", en: "Features", bn: "ফিচার" },
              {
                href: "#how-it-works",
                en: "How it works",
                bn: "কীভাবে কাজ করে",
              },
              { href: "#contact", en: "Contact", bn: "যোগাযোগ" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileNav(false)}
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--df-text-primary)",
                  textDecoration: "none",
                }}
              >
                <T en={l.en} bn={l.bn} lang={lang} />
              </a>
            ))}
            <hr style={{ borderColor: "var(--df-border)" }} />
            <Link
              href="/login"
              className="lp-btn-outline"
              onClick={() => setMobileNav(false)}
              style={{ justifyContent: "center" }}
            >
              <T en="Log in" bn="লগ ইন" lang={lang} />
            </Link>
            <Link
              href="/clinic/register"
              className="lp-btn-primary"
              onClick={() => setMobileNav(false)}
              style={{ justifyContent: "center" }}
            >
              <T en="Get started free" bn="বিনামূল্যে শুরু করুন" lang={lang} />
            </Link>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="lp-hero">
        <Container style={{ maxWidth: 1160 }}>
          <div className="lp-hero-grid">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                  // paddingBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    background: "var(--df-accent)",
                    color: "var(--df-primary)",
                    padding: "4px 10px",
                  }}
                >
                  <T en="New" bn="নতুন" lang={lang} />
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--df-text-muted)",
                  }}
                >
                  <T
                    en="Built for Bangladeshi dental clinics"
                    bn="বাংলাদেশের ডেন্টাল ক্লিনিকের জন্য তৈরি"
                    lang={lang}
                  />
                </span>
              </div>

              <h1
                style={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  fontSize: "clamp(1.9rem, 5vw, 3.1rem)",
                  color: "var(--df-primary)",
                  marginBottom: 16,
                }}
              >
                {lang === "en" ? (
                  <>
                    Run your dental clinic
                    <br />
                    <em
                      style={{
                        fontStyle: "normal",
                        color: "var(--df-secondary)",
                      }}
                    >
                      without the paperwork.
                    </em>
                  </>
                ) : (
                  <>
                    আপনার ডেন্টাল ক্লিনিক পরিচালনা করুন —<br />
                    <em
                      style={{
                        fontStyle: "normal",
                        color: "var(--df-secondary)",
                      }}
                    >
                      কাগজ ছাড়াই।
                    </em>
                  </>
                )}
              </h1>

              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--df-text-secondary)",
                  maxWidth: 460,
                  marginBottom: 36,
                  lineHeight: 1.75,
                }}
              >
                <T
                  en="DentFlow gives you patient records, appointment scheduling, chair management and billing — all in one place. No training required."
                  bn="DentFlow আপনাকে দেয় রোগীর রেকর্ড, অ্যাপয়েন্টমেন্ট শিডিউলিং, চেয়ার ম্যানেজমেন্ট এবং বিলিং — সব এক জায়গায়।"
                  lang={lang}
                />
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  marginBottom: 40,
                }}
              >
                <a href="#contact" className="lp-btn-accent">
                  <T
                    en="Start free trial →"
                    bn="বিনামূল্যে ট্রায়াল শুরু করুন →"
                    lang={lang}
                  />
                </a>
                <a href="#how-it-works" className="lp-btn-outline">
                  <T
                    en="See how it works"
                    bn="কীভাবে কাজ করে দেখুন"
                    lang={lang}
                  />
                </a>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 12,
                  color: "var(--df-text-muted)",
                  fontWeight: 600,
                  flexWrap: "wrap",
                }}
              >
                {[
                  {
                    en: "No credit card required",
                    bn: "ক্রেডিট কার্ড লাগবে না",
                  },
                  { en: "Setup in under 10 minutes", bn: "১০ মিনিটে সেটআপ" },
                  { en: "Bangla & English UI", bn: "বাংলা ও ইংরেজি UI" },
                ].map((t, i) => (
                  <span
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    {i > 0 && (
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "var(--df-accent)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <T en={t.en} bn={t.bn} lang={lang} />
                  </span>
                ))}
              </div>
            </div>

            {/* App preview */}
            <div className="lp-hero-visual" style={{ alignSelf: "flex-end" }}>
              <div className="lp-app-window">
                <div className="lp-topbar">
                  <div className="lp-dot" style={{ background: "#ff5f57" }} />
                  <div className="lp-dot" style={{ background: "#ffbd2e" }} />
                  <div className="lp-dot" style={{ background: "#28c840" }} />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255,255,255,.65)",
                      marginLeft: 8,
                      letterSpacing: ".04em",
                    }}
                  >
                    DentFlow — Today's Schedule
                  </span>
                </div>
                <div style={{ padding: 18 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--df-text-muted)",
                      marginBottom: 10,
                    }}
                  >
                    Today · August 3, 2026
                  </div>
                  {PREVIEW_PATIENTS.map((p) => (
                    <div key={p.initials} className="lp-pcard">
                      <div className="lp-avatar">{p.initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>
                          {p.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--df-text-muted)",
                            marginTop: 1,
                          }}
                        >
                          {p.meta}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "3px 8px",
                          background: p.color,
                          color: p.text,
                        }}
                      >
                        <T en={p.statusEn} bn={p.statusBn} lang={lang} />
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: 8,
                      marginTop: 12,
                    }}
                  >
                    {[
                      { num: "12", en: "Appts", bn: "অ্যাপয়েন্ট" },
                      { num: "3", en: "Chairs", bn: "চেয়ার" },
                      { num: "98%", en: "Confirmed", bn: "নিশ্চিত" },
                    ].map((s) => (
                      <div
                        key={s.en}
                        style={{
                          border: "1px solid var(--df-border)",
                          padding: 10,
                          textAlign: "center",
                          background: "#fff",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "var(--df-primary)",
                          }}
                        >
                          {s.num}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: "var(--df-text-muted)",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: ".07em",
                          }}
                        >
                          <T en={s.en} bn={s.bn} lang={lang} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-section lp-section-alt" id="features">
        <Container style={{ maxWidth: 1160 }}>
          <div
            className="lp-reveal"
            style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}
          >
            <div className="lp-tag">
              <T en="Features" bn="ফিচারসমূহ" lang={lang} />
            </div>
            <h2
              style={{
                fontWeight: 800,
                color: "var(--df-primary)",
                marginBottom: 12,
              }}
            >
              <T
                en="Everything a modern dental clinic needs"
                bn="একটি আধুনিক ডেন্টাল ক্লিনিকের সব কিছু"
                lang={lang}
              />
            </h2>
            <p style={{ color: "var(--df-text-secondary)", fontSize: 14.5 }}>
              <T
                en="From first appointment to final invoice — DentFlow handles it all so your team can focus on patients."
                bn="প্রথম অ্যাপয়েন্টমেন্ট থেকে শেষ ইনভয়েস পর্যন্ত — DentFlow সব সামলায়।"
                lang={lang}
              />
            </p>
            <div
              style={{
                width: 36,
                height: 3,
                background: "var(--df-accent)",
                margin: "14px auto 0",
              }}
            />
          </div>

          <div className="lp-features-grid lp-reveal">
            {FEATURES.map((f) => (
              <div key={f.en.title} className="lp-fcard">
                <div className="lp-fbar" />
                <div className="lp-ficon">{f.icon}</div>
                <h3
                  style={{
                    fontSize: "1.02rem",
                    fontWeight: 700,
                    color: "var(--df-primary)",
                    marginBottom: 8,
                  }}
                >
                  {lang === "bn" ? f.bn.title : f.en.title}
                </h3>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "var(--df-text-secondary)",
                    lineHeight: 1.65,
                  }}
                >
                  {lang === "bn" ? f.bn.desc : f.en.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-section" id="how-it-works">
        <Container style={{ maxWidth: 1160 }}>
          <div
            className="lp-reveal"
            style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}
          >
            <div className="lp-tag">
              <T en="How it works" bn="কীভাবে কাজ করে" lang={lang} />
            </div>
            <h2
              style={{
                fontWeight: 800,
                color: "var(--df-primary)",
                marginBottom: 12,
              }}
            >
              <T
                en="Up and running in minutes"
                bn="মিনিটের মধ্যে চালু হয়"
                lang={lang}
              />
            </h2>
            <p style={{ color: "var(--df-text-secondary)", fontSize: 14.5 }}>
              <T
                en="DentFlow is designed for busy clinics, not IT teams. Four steps and you're live."
                bn="DentFlow ব্যস্ত ক্লিনিকের জন্য তৈরি। মাত্র চারটি ধাপে আপনি লাইভ।"
                lang={lang}
              />
            </p>
            <div
              style={{
                width: 36,
                height: 3,
                background: "var(--df-accent)",
                margin: "14px auto 0",
              }}
            />
          </div>

          <div style={{ maxWidth: 680, margin: "56px auto 0" }}>
            {STEPS.map((s, i) => (
              <div key={i} className="lp-step-row lp-reveal">
                <div className="lp-step-num">{i + 1}</div>
                <div style={{ paddingTop: 10 }}>
                  <h3
                    style={{
                      fontSize: "1.02rem",
                      fontWeight: 700,
                      color: "var(--df-primary)",
                      marginBottom: 6,
                    }}
                  >
                    {lang === "bn" ? s.bn.title : s.en.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--df-text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {lang === "bn" ? s.bn.desc : s.en.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta" id="contact">
        <Container style={{ maxWidth: 1160 }}>
          <div className="lp-cta-grid lp-reveal">
            <div>
              <h2 style={{ fontWeight: 800, color: "#fff", marginBottom: 10 }}>
                <T
                  en="Ready to modernise your clinic?"
                  bn="আপনার ক্লিনিক আধুনিক করতে প্রস্তুত?"
                  lang={lang}
                />
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: "rgba(255,255,255,.65)",
                  marginTop: 8,
                }}
              >
                <T
                  en="Join dental clinics across Bangladesh already using DentFlow. Free trial, no card needed, cancel anytime."
                  bn="বাংলাদেশের অনেক ডেন্টাল ক্লিনিক ইতিমধ্যে DentFlow ব্যবহার করছে। বিনামূল্যে ট্রায়াল, কার্ড লাগবে না।"
                  lang={lang}
                />
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,.4)",
                  marginTop: 14,
                  fontWeight: 500,
                }}
              >
                <T
                  en="✓ No credit card · ✓ Bangla & English UI · ✓ Cancel anytime"
                  bn="✓ ক্রেডিট কার্ড লাগবে না · ✓ বাংলা ও ইংরেজি UI · ✓ যেকোনো সময় বাতিল"
                  lang={lang}
                />
              </p>
            </div>
            <div style={{ display: "flex", gap: 14, flexDirection: "column" }}>
              <a href="#" className="lp-btn-accent">
                <T
                  en="Start free trial →"
                  bn="বিনামূল্যে ট্রায়াল শুরু করুন →"
                  lang={lang}
                />
              </a>
              <a
                href="mailto:hello@dentflow.com.bd"
                className="lp-btn-outline-white"
              >
                <T en="Talk to us" bn="আমাদের সাথে কথা বলুন" lang={lang} />
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <Container style={{ maxWidth: 1160 }}>
          <div className="lp-footer-grid">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    background: "rgba(255,255,255,.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                    <circle cx="12" cy="9" r="2.2" fill="#fff" stroke="none" />
                  </svg>
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
                  Dent<span style={{ color: "var(--df-accent)" }}>Flow</span>
                </span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, maxWidth: 220 }}>
                <T
                  en="Dental practice management software built for Bangladeshi clinics."
                  bn="বাংলাদেশের ডেন্টাল ক্লিনিকের জন্য তৈরি প্র্যাকটিস ম্যানেজমেন্ট সফটওয়্যার।"
                  lang={lang}
                />
              </p>
            </div>

            {[
              {
                enHead: "Product",
                bnHead: "পণ্য",
                links: [
                  { href: "#features", en: "Features", bn: "ফিচার" },
                  {
                    href: "#how-it-works",
                    en: "How it works",
                    bn: "কীভাবে কাজ করে",
                  },
                  { href: "#", en: "Changelog", bn: "পরিবর্তন লগ" },
                  { href: "#", en: "Roadmap", bn: "রোডম্যাপ" },
                ],
              },
              {
                enHead: "Support",
                bnHead: "সহায়তা",
                links: [
                  { href: "#", en: "Help Centre", bn: "সাহায্য কেন্দ্র" },
                  { href: "#", en: "Getting started", bn: "শুরু করা" },
                  { href: "#", en: "Contact us", bn: "যোগাযোগ করুন" },
                  { href: "#", en: "System status", bn: "সিস্টেম স্ট্যাটাস" },
                ],
              },
              {
                enHead: "Company",
                bnHead: "কোম্পানি",
                links: [
                  { href: "#", en: "About", bn: "আমাদের সম্পর্কে" },
                  { href: "#", en: "Blog", bn: "ব্লগ" },
                  { href: "#", en: "Careers", bn: "ক্যারিয়ার" },
                  {
                    href: "mailto:hello@dentflow.com.bd",
                    en: "hello@dentflow.com.bd",
                    bn: "hello@dentflow.com.bd",
                  },
                ],
              },
            ].map((col) => (
              <div key={col.enHead}>
                <h4
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "#fff",
                    marginBottom: 14,
                  }}
                >
                  <T en={col.enHead} bn={col.bnHead} lang={lang} />
                </h4>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                  }}
                >
                  {col.links.map((l) => (
                    <li key={l.en}>
                      <a href={l.href} className="lp-footer-link">
                        <T en={l.en} bn={l.bn} lang={lang} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              paddingTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 12 }}>
              <T
                en="© 2026 DentFlow. All rights reserved."
                bn="© ২০২৬ DentFlow. সর্বস্বত্ব সংরক্ষিত।"
                lang={lang}
              />
            </span>
            <div style={{ display: "flex", gap: 20 }}>
              {[
                { en: "Privacy Policy", bn: "গোপনীয়তা নীতি" },
                { en: "Terms of Service", bn: "সেবার শর্তাবলী" },
                { en: "Cookie Policy", bn: "কুকি নীতি" },
              ].map((l) => (
                <a
                  key={l.en}
                  href="#"
                  className="lp-footer-link"
                  style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}
                >
                  <T en={l.en} bn={l.bn} lang={lang} />
                </a>
              ))}
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}
