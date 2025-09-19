import "ldrs/react/Ring.css";
import "ldrs/react/Infinity.css";
import "ldrs/react/Mirage.css";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Head from "next/head"

export const metadata = {
  title: "Next ERP",
  description: "Your project",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/graphic-era-university-dehradun-logo.png" />
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
  )
}
