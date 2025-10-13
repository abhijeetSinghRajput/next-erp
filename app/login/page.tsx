import { generateMetadata as createMetadata } from "@/lib/metadata";
import LoginClient from "./LoginClient";

export const metadata = createMetadata({
  title: "Login | GEU Quick Access",
  description:
    "Login to GEU Quick Access to securely access your Graphic Era University ERP dashboard, including attendance, fees, and exam results.",
  url: "https://geu-quick-access.vercel.app/login",
  image: "https://geu-quick-access.vercel.app/og/loginpage.png",
  imageAlt: "GEU Quick Access Login Page Preview",
});

export default function LoginPage() {
  return <LoginClient />;
}