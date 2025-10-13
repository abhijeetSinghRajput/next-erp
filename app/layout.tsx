import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import OGMeta from "@/components/OGMeta"; 

export const metadata = {
  title: "GEU Quick Access - Graphic Era ERP Dashboard",
  description:
    "GEU Quick Access is a modern Graphic Era University ERP dashboard that lets students easily track attendance, fees, and exam results.",
  url: "https://geu-quick-access.vercel.app/",
  image: "https://geu-quick-access.vercel.app/geu-circular-logo.png",
  imageAlt: "GEU Quick Access Dashboard",
  keywords: [
    "GEU Quick Access",
    "Graphic Era University",
    "GEU ERP",
    "Student Dashboard",
    "Attendance Tracker",
    "Fees Portal",
    "Exam Results",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OGMeta
          title={metadata.title}
          description={metadata.description}
          url={metadata.url}
          image={metadata.image}
          imageAlt={metadata.imageAlt}
          keywords={metadata.keywords}
        />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
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
