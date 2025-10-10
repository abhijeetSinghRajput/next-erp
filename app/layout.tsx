import "ldrs/react/Ring.css";
import "ldrs/react/Infinity.css";
import "ldrs/react/Mirage.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";

export const metadata = {
  title: "Graphic Era Dashboard",
  description:
    "A custom Graphic Era ERP dashboard to track attendance, fees, and results seamlessly.",
  keywords: [
    "Graphic Era",
    "GEU ERP",
    "Graphic Era University",
    "Student Dashboard",
    "Attendance Tracker",
    "Fees Portal",
  ],
  authors: [
    { name: "Abhijeet Singh Rajput", url: "https://mrcodium.netlify.app" },
  ],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    type: "website",
    url: "https://geu-erp.vercel.app/",
    title: "Graphic Era Dashboard",
    description:
      "Your personalized ERP dashboard for Graphic Era University with modern UI.",
    images: [
      {
        url: "https://geu-erp.vercel.app/geu-circular-logo.png",
        width: 1200,
        height: 630,
        alt: "Graphic Era ERP Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    url: "https://geu-erp.vercel.app/",
    title: "Graphic Era Dashboard",
    description:
      "Your personalized ERP dashboard for Graphic Era University with modern UI.",
    images: ["https://geu-erp.vercel.app/geu-circular-logo.png"],
  },
  alternates: {
    canonical: "https://geu-erp.vercel.app/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="theme-color" content="#0a0a0a" />
      </Head>

      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
