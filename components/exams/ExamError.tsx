import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface ExamErrorProps {
  heading?: string;
  onReload?: () => void;
  description?: string;
}

const ExamError = ({
  heading = "Exam Summary",
  onReload,
  description,
}: ExamErrorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
      className="space-y-4 w-full relative"
    >
      <div className="absolute z-20 opacity inset-0 bg-background/70 flex items-center justify-center p-4 m-0">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
          <h3 className="text-2xl font-medium text-destructive">
            Failed to Load Result
          </h3>
          <p className="text-destructive max-w-md">
            {description ||
              "We couldn't load the exam result. Please check your connection and try again."}
          </p>
          {onReload && (
            <Button
              onClick={onReload}
              className="mt-4 gap-2"
              variant="default"
              size="default"
            >
              <RefreshCw />
              Retry
            </Button>
          )}
        </div>
      </div>
      {[...Array(2)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-3xl gap-0 py-0 bg-destructive/10 border-destructive/30">
            <CardHeader className="pb-0 justify-between pt-6 items-center flex">
              <Skeleton
                className={"animate-none bg-destructive/30 h-7 w-[150px]"}
              />
              <Skeleton className="animate-none bg-destructive/30 size-8" />
            </CardHeader>
            <CardContent className="flex p-6 justify-between items-start">
              <div className="space-y-2">
                <Skeleton
                  className={"animate-none bg-destructive/30 h-7 w-[100px]"}
                />
                <Skeleton
                  className={"animate-none bg-destructive/30 h-7 w-[100px]"}
                />
              </div>

              <div className="size-[85px] rounded-full aspect-square border-8 border-destructive/30 flex items-center justify-center">
                <div className="space-y-1 w-1/2">
                  <Skeleton className={"animate-none bg-destructive/30 h-6"} />
                  <Skeleton className={"animate-none bg-destructive/30 h-3"} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ExamError;
