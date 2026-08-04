export type Lang = "en" | "bn";

export function T({
  en,
  bn,
  lang,
}: {
  en: string;
  bn: string;
  lang: Lang;
}): string {
  return lang === "bn" ? bn : en;
}
