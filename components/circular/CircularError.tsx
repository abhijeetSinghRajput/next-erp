import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface CircularErrorProps {
  variant?: "destructive" | "default";
  heading?: string;
  onReload?: () => void;
  description?: string | null;
}

const CircularError: React.FC<CircularErrorProps> = ({
  variant = "destructive",
  heading = "something went wrong",
  onReload,
  description,
}) => {
  return (
    <div className="max-w-screen-lg mx-auto px-2 sm:px-4 md:px-6 py-2">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">Notices</h2>

      <div className="space-y-4 relative">
        <div className="absolute inset-0 bg-background/70 flex items-center justify-center m-0">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
            <h3 className="text-2xl font-medium text-destructive">{heading}</h3>
            <p className="max-w-[380px] text-destructive">
              {description ||
                "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi molestias soluta animi totam."}
            </p>
            {onReload && (
              <Button
                variant=""
                size=""
                onClick={onReload}
                className="mt-4 gap-2"
              >
                <RefreshCw />
                Retry
              </Button>
            )}
          </div>
        </div>
        {[...Array(3)].map((_, idx) => (
          <Card
            key={idx}
            className={cn(
              variant == "destructive" && "bg-destructive/10 ",
              "w-full rounded-3xl shadow-lg gap-0"
            )}
          >
            <CardHeader className="flex p-6 pb-4 gap-2 flex-row items-start">
              <Skeleton
                className={cn(
                  variant === "destructive" && "bg-destructive/10 ",
                  "animate-none aspect-square size-14 rounded-2xl)"
                )}
              />
              <div className="space-y-1 w-full">
                <Skeleton
                  className={cn(
                    variant === "destructive" && "bg-destructive/10 ",
                    "animate-none h-7 max-w-[280px]"
                  )}
                />
                <Skeleton
                  className={cn(
                    variant === "destructive" && "bg-destructive/10 ",
                    "animate-none h-5 max-w-[150px]"
                  )}
                />
              </div>
            </CardHeader>
            <CardContent className={"p-6 pt-0 space-y-1"}>
              <Skeleton
                className={cn(
                  variant === "destructive" && "bg-destructive/10 ",
                  "animate-none h-5 w-full"
                )}
              />
              <Skeleton
                className={cn(
                  variant === "destructive" && "bg-destructive/10 ",
                  "animate-none h-5 max-w-28"
                )}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CircularError;
