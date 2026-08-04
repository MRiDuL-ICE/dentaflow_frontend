"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { Lang, T } from "./types";

const NAV_LINKS = [
  { href: "#features", en: "Features", bn: "ফিচার" },
  { href: "#how-it-works", en: "How it works", bn: "কীভাবে কাজ করে" },
  { href: "#contact", en: "Contact", bn: "যোগাযোগ" },
];

interface Props {
  lang: Lang;
  switchLang: (l: Lang) => void;
  mobileNav: boolean;
  setMobileNav: (v: boolean) => void;
}

export default function Navbar({
  lang,
  switchLang,
  mobileNav,
  setMobileNav,
}: Props) {
  return (
    <>
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
              width={100}
              height={80}
              style={{ width: 80, height: 80 }}
            />
          </Link>

          {/* Desktop links */}
          <ul className="d-none d-md-flex align-items-center gap-4 mb-0 list-unstyled">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
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
                </Link>
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
            {/* Language pill */}
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

            <button
              className="d-flex d-md-none lp-hamburger-btn"
              onClick={() => setMobileNav(true)}
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNav && (
          <div key="mobile-nav" className="lp-mobile-nav">
            <div
              className="lp-mobile-backdrop"
              onClick={() => setMobileNav(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lp-mobile-drawer"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  className="lp-drawer-close-btn"
                  onClick={() => setMobileNav(false)}
                  aria-label="Close menu"
                >
                  <FiX size={20} />
                </button>
              </div>
              <hr style={{ borderColor: "var(--df-border)" }} />
              {NAV_LINKS.map((l) => (
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
                <T
                  en="Get started free"
                  bn="বিনামূল্যে শুরু করুন"
                  lang={lang}
                />
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
