import { ExternalLink, GitBranch } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useCookieStore } from "../../stores/useCookieStore";

const DataFetchingSection = () => {
  const { getBaseUrl } = useCookieStore();
  return (
    <section id="data-fetching" className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="flex items-center gap-2">
          <GitBranch className="text-primary" />
          How We Fetch Data
        </h3>
        <Link
          href="/docs"
          className="text-sm flex items-center gap-2 text-primary font-semibold underline underline-offset-2"
        >
          See Docs <ExternalLink size={16} />
        </Link>
      </div>

      <div className="text-muted-foreground space-y-4">
        <p>
          The portal{" "}
          <strong className="text-foreground">
            does not scrape or directly access GEU databases
          </strong>
          . Instead, it communicates securely with the official{" "}
          <a href={getBaseUrl()} className="text-primary hover:underline">
            GEU ERP servers
          </a>{" "}
          using your authenticated session and verification tokens.
        </p>

        <blockquote>
          &quot;All requests are proxied to official ERP endpoints. No personal
          data or credentials are stored on our servers.&quot;
        </blockquote>

        <p>🔑 Our data-fetching flow works as follows:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Session Initialization:</strong> A secure session is
            established with <code>ASP.NET_SessionId</code> and{" "}
            <code>__RequestVerificationToken</code>.
          </li>
          <li>
            <strong>Authentication:</strong> Login credentials are sent only to
            the official GEU login API. We never log or store them.
          </li>
          <li>
            <strong>Request Proxying:</strong> After login, the portal forwards
            requests (attendance, exams, profile, etc.) to official ERP
            endpoints with your valid session cookies.
          </li>
          <li>
            <strong>Temporary Data:</strong> Data is displayed in your browser
            but never persisted on our servers.
          </li>
        </ul>

        <blockquote>
          &quot;Minimal access, maximum security – we only fetch what you request.&quot;
        </blockquote>
      </div>
    </section>
  );
};

export default DataFetchingSection;
