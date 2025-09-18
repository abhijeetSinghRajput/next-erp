"use client";

import { cn, formatRelativeDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useNoticeStore, type Circular } from "@/stores/useCircularStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import CircularDetailsDrawer from "./CircularsDrawer";
import CircularError from "./CircularError";
import CircularSkeleton from "./CircularSkeleton";

interface IconConfig {
  icon: string;
  color: string;
}

interface IconsMap {
  [key: string]: IconConfig;
}

const icons: IconsMap = {
  "Information Cell": { icon: "🗞️", color: "#1e86ff" },
  "Fee Cell": { icon: "💸", color: "#00c9a7" },
  "Examination Cell": { icon: "🎓", color: "#f9a825" },
};

const Circular: React.FC = () => {
  const {
    circulars,
    isLoadingCirculars,
    getCirculars,
    getAllCirculars,
    errors,
  } = useNoticeStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    getCirculars();
    getAllCirculars();
  }, [getCirculars, getAllCirculars]);

  // Automatically cycle through circulars
  useEffect(() => {
    if (circulars.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % circulars.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [circulars.length]);

  const visibleCirculars: Circular[] = useMemo(() => {
    if (circulars.length <= 3) return circulars;

    const items: Circular[] = [];
    for (let i = 0; i < 3; i++) {
      const circular = circulars[(currentIndex + i) % circulars.length];
      if (circular) items.push(circular);
    }
    return items;
  }, [currentIndex, circulars]);

  if (isLoadingCirculars) {
    return <CircularSkeleton />;
  }

  if (errors.getCirculars || !circulars) {
    return (
      <CircularError
        description={errors.getCirculars}
        onReload={getCirculars}
      />
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-2 sm:px-4 md:px-6 py-2">
      <div className="flex justify-between items-center gap-2 py-2">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Notices</h2>

        <CircularDetailsDrawer />
      </div>
      <div className="relative min-h-[580px] sm:min-h-[500px] h-full w-full overflow-hidden">
        {/* Top Gradient */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background/90 to-transparent pointer-events-none z-40" />
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background/90 to-transparent pointer-events-none z-40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <AnimatePresence mode="popLayout">
            {visibleCirculars.map((circular, index) => (
              <motion.div
                key={circular.CirID || index}
                layout
                initial={{
                  opacity: 0,
                  y: 50,
                  scale: 0.9,
                  filter: "blur(2px)",
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -50,
                  scale: 0.9,
                  filter: "blur(2px)",
                  transition: {
                    duration: 0.3,
                  },
                }}
                className={cn(
                  "w-full",
                  index === 0
                    ? "z-30"
                    : index === 1
                    ? "z-20 opacity-90"
                    : "z-10 opacity-70"
                )}
                style={{
                  transformOrigin: "top center",
                }}
              >
                <Card className="w-full rounded-3xl shadow-lg gap-0">
                  <CardHeader className="flex pb-4 gap-2 flex-row items-start">
                    <div
                      className="aspect-square size-14 rounded-2xl text-3xl flex items-center justify-center"
                      style={{
                        background:
                          icons[circular.ByDepartment]?.color || "#ffb800",
                      }}
                    >
                      {icons[circular.ByDepartment]?.icon || "📢"}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="line-clamp-2 text-base sm:text-lg">
                        {circular.Subject}
                      </CardTitle>
                      <div className="text-sm flex gap-2 text-muted-foreground">
                        {formatRelativeDate(circular.DateFrom)}
                        <Badge className={""} variant="secondary">
                          {circular.ByDepartment}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className={""}>
                    <div
                      className="line-clamp-3 text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: circular.Notice }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Circular;
