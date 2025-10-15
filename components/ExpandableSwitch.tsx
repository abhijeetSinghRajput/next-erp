"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "../stores/useAuthStore";
import { useCookieStore } from "../stores/useCookieStore";
import Image from "next/image";
import TooltipWrapper from "./TooltipWrapper";

const campus = [
  { name: "Deemed", value: "deemed", icon: "/D.svg" },
  { name: "Hill", value: "hill", icon: "H.svg" },
];

const ExpandableSwitch = () => {
  const { getCaptcha } = useAuthStore();
  const { campus: activeCampus, setCampus } = useCookieStore();
  const firstRender = useRef(true);

  // Call captcha only when user switches (not on first render)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    getCaptcha();
  }, [activeCampus, getCaptcha]);

  return (
    <div className="w-full max-w-md">
      <div className="flex gap-2 rounded-xl p-1 border bg-muted/50">
        {campus.map(({ icon, name, value }) => {
          const isActive = activeCampus === value;
          return (
            <TooltipWrapper key={value} content={name}>
              <motion.div
                layout
                className={cn(
                  "flex h-8 items-center bg-muted justify-center overflow-hidden rounded-md cursor-pointer transition-colors",
                  isActive ? "flex-1" : "flex-none"
                )}
                onClick={() => setCampus(value as "deemed" | "hill")}
                initial={false}
                animate={{ width: isActive ? 120 : 36 }}
                transition={{ type: "tween", duration: 0.25 }}
              >
                <motion.div
                  className="flex h-8 w-full items-center gap-2 px-2"
                  animate={{ filter: "blur(0px)" }}
                  exit={{ filter: "blur(2px)" }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Image src={icon} alt="icon" height={32} width={32} />
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        key={value}
                        className="font-medium whitespace-nowrap"
                        initial={{ opacity: 0, scaleX: 0.8 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        style={{ originX: 0 }}
                      >
                        {name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </TooltipWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default ExpandableSwitch;
