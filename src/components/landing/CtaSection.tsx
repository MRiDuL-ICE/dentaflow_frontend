import { Container } from "reactstrap";
import { Lang, T } from "./types";

export default function CtaSection({ lang }: { lang: Lang }) {
  return (
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
                en="Join dental clinics across Worldwide already using DentFlow. Free trial, no card needed, cancel anytime."
                bn="বিনামূল্যে অনেক ডেন্টাল ক্লিনিক ইতিমধ্যে DentFlow ব্যবহার করছে। বিনামূল্যে ট্রায়াল, কার্ড লাগবে না।"
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
  );
}
