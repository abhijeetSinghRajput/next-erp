import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface TooltipWrapperProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

const TooltipWrapper = ({ children, content }: TooltipWrapperProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="" >{content}</TooltipContent>
    </Tooltip>
  );
};

export default TooltipWrapper;
