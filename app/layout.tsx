// app/layout.tsx
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

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
  viewport: "width=device-width, initial-scale=1",
  alternates: { canonical: "https://geu-erp.vercel.app/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <meta name="viewport" content={metadata.viewport} />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="canonical" href={metadata.alternates.canonical} />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
