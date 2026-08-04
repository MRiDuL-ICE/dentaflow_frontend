import Image from "next/image";
import { Container } from "reactstrap";
import { Lang, T } from "./types";

const FOOTER_COLS = [
  {
    enHead: "Product",
    bnHead: "পণ্য",
    links: [
      { href: "#features", en: "Features", bn: "ফিচার" },
      { href: "#how-it-works", en: "How it works", bn: "কীভাবে কাজ করে" },
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
];

const LEGAL_LINKS = [
  { en: "Privacy Policy", bn: "গোপনীয়তা নীতি" },
  { en: "Terms of Service", bn: "সেবার শর্তাবলী" },
  { en: "Cookie Policy", bn: "কুকি নীতি" },
];

export default function FooterSection({ lang }: { lang: Lang }) {
  return (
    <footer className="lp-footer">
      <Container style={{ maxWidth: 1160 }}>
        <div className="lp-footer-grid">
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <Image src="/logo.png" alt="DentFlow" width={120} height={120} />
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.75, maxWidth: 220 }}>
              <T
                en="Dental practice management software built for worldwide clinics."
                bn="বিনামূল্যে ডেন্টাল ক্লিনিকের জন্য তৈরি প্র্যাকটিস ম্যানেজমেন্ট সফটওয়্যার।"
                lang={lang}
              />
            </p>
          </div>

          {/* Columns */}
          {FOOTER_COLS.map((col) => (
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

        {/* Bottom bar */}
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
            {LEGAL_LINKS.map((l) => (
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
  );
}
