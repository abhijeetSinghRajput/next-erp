import { generateMetadata as createMetadata } from "@/lib/metadata";
import DocsClient from "./DocsClient";

export const metadata = createMetadata({
  title: "Documentation | GEU Quick Access",
  description:
    "Technical documentation for GEU Quick Access — explore architecture, APIs, and ERP dashboard features.",
  url: "https://geu-quick-access.vercel.app/docs",
  image: "https://geu-quick-access.vercel.app/og/docs.png",
  imageAlt: "GEU Quick Access Documentation Preview",
});

export default function DocsPage() {
  return <DocsClient />;
}