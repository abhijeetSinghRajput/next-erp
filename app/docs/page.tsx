"use client";

import {
  Cookie,
  Globe,
  Layers,
  Monitor,
  Server,
  Settings,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import OverviewSection from "./OverviewSection";
import SpeedOptimizationSection from "./SpeedOptimizationSection";
import SessionManagementSection from "./SessionManagementSection";
import HeaderMimicingSection from "./HeaderMimicingSection";
import ArchitectureSection from "./ArchitectureSection";
import UIDesignSection from "./UIDesignSection";
import SecuritySection from "./SecuritySection";
import APIEndpointsSection from "./APIEndpointsSection";
import FaqSection from "./FaqSection";
import TechnicalDeepDive from "./TechnicalDeepDive";
import PerformanceMetrics from "./PerformanceMetrics";
import { Separator } from "@/components/ui/separator";
import Sidebar from "../../components/Sidebar";

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState("transparency");

  const sections = [
    { id: "overview", title: "Project Overview", icon: Globe },
    { id: "speed", title: "Performance & Speed", icon: Zap },
    { id: "session", title: "Session Management", icon: Cookie },
    { id: "headers", title: "Header Manipulation", icon: Globe },
    { id: "architecture", title: "System Architecture", icon: Settings },
    { id: "ui", title: "UI/UX Design", icon: Layers },
    { id: "security", title: "Security & Privacy", icon: Monitor },
    { id: "api", title: "API Endpoints", icon: Shield },
    { id: "faq", title: "Frequently Asked Questions", icon: Server },
    { id: "technical", title: "Technical Deep Dive", icon: Users },
    { id: "metrics", title: "Performance Metrics", icon: Zap },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections
        .map((section) => document.getElementById(section.id))
        .filter(Boolean);

      const scrollPosition = window.scrollY + 100;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId : string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <Header>
        <Sidebar items={sections} heading="Documentation" />
      </Header>
      <div className="relative min-h-screen w-full p-2 sm:p-4 lg:p-8 docs">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-cal-sans pt-8 text-3xl md:text-4xl lg:pt-12">
            Docs
          </h1>
          <div className="relative flex md:mb-[50vh] gap-12 py-[40px] md:py-[80px]">
            <ul className="border-foreground/10 sticky top-24 hidden h-fit w-full max-w-[240px] space-y-3 border-l md:block min-w-max">
              {sections.map((section) => (
                <li key={section.id} className="relative cursor-pointer pl-3">
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className="text-left w-full flex items-center gap-2"
                  >
                    {activeSection === section.id && (
                      <span className="bg-foreground absolute -left-[1.5px] top-1/2 inline-block h-5 w-[2px] -translate-y-1/2 rounded-2xl" />
                    )}
                    <p
                      className={`transition-opacity duration-200 text-sm ${
                        activeSection === section.id
                          ? "text-foreground opacity-100 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {section.title}
                    </p>
                  </button>
                </li>
              ))}
            </ul>

            <main className="flex flex-1 flex-col gap-16 sm:gap-20 md:gap-12 overflow-x-hidden">
              <OverviewSection /> <Separator className={undefined} />
              <SpeedOptimizationSection /> <Separator className={undefined} />
              <SessionManagementSection /> <Separator className={undefined} />
              <HeaderMimicingSection /> <Separator className={undefined} />
              <ArchitectureSection /> <Separator className={undefined} />
              <UIDesignSection /> <Separator className={undefined} />
              <SecuritySection /> <Separator className={undefined} />
              <APIEndpointsSection /> <Separator className={undefined} />
              <FaqSection /> <Separator className={undefined} />
              <TechnicalDeepDive /> <Separator className={undefined} />
              <PerformanceMetrics />
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocsPage;
