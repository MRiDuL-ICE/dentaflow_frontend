import Image from "next/image";
import { Container } from "reactstrap";
import { Lang, T } from "./types";
import { PREVIEW_PATIENTS } from "./data";

const TRUST_BADGES = [
  { en: "No credit card required", bn: "ক্রেডিট কার্ড লাগবে না" },
  { en: "Setup in under 10 minutes", bn: "১০ মিনিটে সেটআপ" },
  { en: "Bangla & English UI", bn: "বাংলা ও ইংরেজি UI" },
];

const STATS = [
  { num: "12", en: "Appts", bn: "অ্যাপয়েন্ট" },
  { num: "3", en: "Chairs", bn: "চেয়ার" },
  { num: "98%", en: "Confirmed", bn: "নিশ্চিত" },
];

export default function HeroSection({ lang }: { lang: Lang }) {
  // i want date like August 4, 2026
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <section className="lp-hero">
      <Container style={{ maxWidth: 1160 }}>
        <div className="lp-hero-grid">
          {/* ── Left copy ── */}
          <div>
            {/* Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
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
                  en="Built for World wide dental clinics"
                  bn="সকল ডেন্টাল ক্লিনিকের জন্য তৈরি"
                  lang={lang}
                />
              </span>
            </div>

            {/* Headline */}
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

            {/* Sub */}
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

            {/* CTA buttons */}
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

            {/* Trust badges */}
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
              {TRUST_BADGES.map((t, i) => (
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

          {/* ── Right app preview ── */}
          <div className="lp-hero-visual" style={{ alignSelf: "flex-end" }}>
            <div className="lp-app-window" style={{ borderRadius: 6 }}>
              {/* Fake titlebar */}
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
                  Today · {today}
                </div>

                {/* Patient rows */}
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

                {/* Stats row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  {STATS.map((s) => (
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
  );
}
