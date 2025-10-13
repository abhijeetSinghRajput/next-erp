import { generateMetadata as createMetadata } from "@/lib/metadata";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata = createMetadata({
  title: "Forgot Password | GEU Quick Access",
  description:
    "Reset your Graphic Era University ERP password securely using GEU Quick Access. Enter your registered email and follow the instructions to recover your account.",
  url: "https://geu-quick-access.vercel.app/forgot-password",
  image: "https://geu-quick-access.vercel.app/og/forgot-password.png",
  imageAlt: "GEU Quick Access Forgot Password Page Preview",
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}