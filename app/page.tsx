import { generateMetadata as createMetadata } from "@/lib/metadata";
import HomePageClient from "./HomePageClient";

export const metadata = createMetadata({
  title: "Dashboard | GEU Quick Access",
  description:
    "Access your Graphic Era University ERP dashboard with GEU Quick Access. View attendance, fees, exam results, and circulars in one place.",
  url: "https://geu-quick-access.vercel.app/",
  image: "https://geu-quick-access.vercel.app/og/dashboard.png",
  imageAlt: "GEU Quick Access Dashboard Preview",
});

export default function HomePage() {
  return <HomePageClient />;
}