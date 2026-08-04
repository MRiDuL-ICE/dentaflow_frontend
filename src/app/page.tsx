"use client";

import { useEffect, useState } from "react";
import { Lang } from "@/components/landing/types";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CtaSection from "@/components/landing/CtaSection";
import FooterSection from "@/components/landing/FooterSection";

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [mobileNav, setMobileNav] = useState(false);

  // Persist language choice
  useEffect(() => {
    const saved = localStorage.getItem("df-lang") as Lang | null;
    if (saved) setLang(saved);
  }, []);

  function switchLang(l: Lang) {
    setLang(l);
    localStorage.setItem("df-lang", l);
  }

  // Scroll-reveal
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
      <Navbar
        lang={lang}
        switchLang={switchLang}
        mobileNav={mobileNav}
        setMobileNav={setMobileNav}
      />
      <HeroSection lang={lang} />
      <FeaturesSection lang={lang} />
      <HowItWorksSection lang={lang} />
      <CtaSection lang={lang} />
      <FooterSection lang={lang} />
    </>
  );
}
