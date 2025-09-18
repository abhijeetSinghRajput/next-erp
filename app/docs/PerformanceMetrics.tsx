import { CheckCircle, Zap } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

const performanceData = [
  {
    title: "Our Implementation",
    color: "green",
    metrics: [
      { label: "Initial Load Time", value: "~1.2s" },
      { label: "Navigation Speed", value: "~0ms" },
      { label: "Data Refresh", value: "~300ms" },
      { label: "Mobile Performance", value: "95/100" },
    ],
  },
  {
    title: "Official GEU Website",
    color: "red",
    metrics: [
      { label: "Initial Load Time", value: "~4.5s" },
      { label: "Navigation Speed", value: "~2.8s" },
      { label: "Data Refresh", value: "~3.2s" },
      { label: "Mobile Performance", value: "32/100" },
    ],
  },
];

const keyFactors = [
  { title: "Zero Page Reloads", desc: "SPA architecture eliminates navigation overhead" },
  { title: "Persistent Sessions", desc: "No repeated authentication required" },
  { title: "Smart Caching", desc: "Avoid redundant API calls with state management" },
  { title: "Progressive Loading", desc: "Priority-based data fetching strategy" },
  { title: "Modern UI", desc: "React optimizations and efficient rendering" },
  { title: "Direct Streaming", desc: "Files served without intermediate buffering" },
];

type Metric = { label: string; value: string };

interface PerformanceCardProps {
  title: string;
  color: string;
  metrics: Metric[];
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ title, color, metrics }) => {
  return (
    <div
      className={twMerge(
        `p-4 sm:p-6 rounded-lg border`,
        color === "green" ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" : "",
        color === "red" ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800" : ""
      )}
    >
      <h4
        className={twMerge(
          "font-semibold mb-4",
          color === "green" ? "text-green-800 dark:text-green-200" : "",
          color === "red" ? "text-red-800 dark:text-red-200" : ""
        )}
      >
        {title}
      </h4>
      <div className="space-y-3">
        {metrics.map((m, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-sm">{m.label}</span>
            <span
              className={twMerge(
                "font-mono text-sm px-2 py-1 rounded",
                color === "green" ? "bg-green-100 dark:bg-green-900" : "",
                color === "red" ? "bg-red-100 dark:bg-red-900" : ""
              )}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PerformanceMetrics: React.FC = () => {
  return (
    <section id="metrics" className="space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="w-6 h-6 text-primary flex-shrink-0" />
        <h3>Performance Metrics</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {performanceData.map((card, idx) => (
          <PerformanceCard key={idx} {...card} />
        ))}
      </div>

      <div>
        <h4 className="font-semibold mb-4">Key Performance Factors</h4>
        <ul className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          {keyFactors.map((factor, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="flex-shrink-0 w-4 h-4 mt-1 text-green-500" />
              <span>
                <strong>{factor.title}:</strong> {factor.desc}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PerformanceMetrics;
