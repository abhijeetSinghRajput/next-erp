import { generateMetadata as createMetadata } from "@/lib/metadata";
import PrivacyPolicyClient from "./PolicyClient";

export const metadata = createMetadata({
  title: "Privacy Policy | GEU Quick Access",
  description:
    "Read the Privacy Policy for GEU Quick Access. Learn how we protect your data and ensure secure access to Graphic Era University ERP services.",
  url: "https://geu-quick-access.vercel.app/policy",
  image: "https://geu-quick-access.vercel.app/og/privacy-policy.png",
  imageAlt: "GEU Quick Access Privacy Policy Preview",
});

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}