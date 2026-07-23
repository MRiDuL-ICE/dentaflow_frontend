import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/login");
}

export const metadata = {
  title: "DentaFlow",
  description: "Intelligent multi-tenant dental clinic management platform",
};
