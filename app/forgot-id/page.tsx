import { generateMetadata as createMetadata } from "@/lib/metadata";
import ForgotIdClient from "./ForgotIdClient";

export const metadata = createMetadata({
  title: "Forgot ID | GEU Quick Access",
  description:
    "Recover your Graphic Era University ERP User ID through GEU Quick Access. Enter your registered email to retrieve your account credentials.",
  url: "https://geu-quick-access.vercel.app/forgot-id",
  image: "https://geu-quick-access.vercel.app/og/forgot-id.png",
  imageAlt: "GEU Quick Access Forgot ID Page Preview",
});

export default function ForgotIdPage() {
  return <ForgotIdClient />;
}