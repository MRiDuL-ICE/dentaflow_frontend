import { Container } from "reactstrap";
import { Lang, T } from "./types";
import { STEPS } from "./data";

export default function HowItWorksSection({ lang }: { lang: Lang }) {
  return (
    <section className="lp-section" id="how-it-works">
      <Container style={{ maxWidth: 1160 }}>
        {/* Heading */}
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

        {/* Steps */}
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
  );
}
