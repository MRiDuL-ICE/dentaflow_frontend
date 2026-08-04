import { Container } from "reactstrap";
import { Lang, T } from "./types";
import { FEATURES } from "./data";

export default function FeaturesSection({ lang }: { lang: Lang }) {
  return (
    <section className="lp-section lp-section-alt" id="features">
      <Container style={{ maxWidth: 1160 }}>
        {/* Heading */}
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

        {/* Cards */}
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
  );
}
