import React, { useState } from "react";
import DataTable from "@/components/table/DataTable";
import {
  AlertTriangle,
  ChevronDown,
  ClipboardCheck,
  InfoIcon,
  RefreshCw,
  Smile,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useExamStore } from "@/stores/useExamStore";
import { Ring } from "ldrs/react";

type Backlog = {
  SubjectCode: string;
  Subject: string;
  YearSem?: string;
  YS?: string;
  PaperType?: string;
};

interface BacklogsProps {
  backlogs?: Backlog[];
}

const Backlogs: React.FC<BacklogsProps> = ({ backlogs }) => {
  // Ensure backlogs is an array and provide default value
  const { errors, getBacklogs, loadingBacklogs } = useExamStore();
  const safeBacklogs = Array.isArray(backlogs) ? backlogs : [];

  const processedBacklogs = safeBacklogs.map((log: Backlog) => ({
    ...log,
    PaperType: log.SubjectCode.startsWith("TMC") ? "Theory" : "Lab",
  }));

  const termType = processedBacklogs[0]?.YS || "Semester";

  const [visibleColumns, setVisibleColumns] = useState({
    SubjectCode: true,
    Subject: true,
    [termType]: true,
    PaperType: true,
  });

  const toggleColumnVisibility = (columnId: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const columns = [
    { id: "SubjectCode", header: "Subject Code", sortable: true },
    { id: "Subject", header: "Subject Name", sortable: true },
    { id: "PaperType", header: "Paper Type", sortable: false },
    { id: "YearSem", header: termType, sortable: true },
  ];

  return (
    <Card className="rounded-2xl overflow-hidden py-0 gap-0">
      <CardHeader className="border bg-muted p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className={""}>Backlog Details</CardTitle>
            <CardDescription className="flex gap-2">
              <Badge
                className={""}
                variant="destructive"
              >{`${processedBacklogs.length} Backlogs`}</Badge>
              that need to be cleared
            </CardDescription>
          </div>
          <div className="flex gap-2 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto gap-1 bg-input"
                >
                  <span>Columns</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={visibleColumns[column.id]}
                    onCheckedChange={() => toggleColumnVisibility(column.id)}
                  >
                    {column.header}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="border p-0">
        {processedBacklogs && processedBacklogs.length > 0 ? (
          <div className="space-y-6">
            <DataTable
              data={processedBacklogs}
              columns={columns}
              visibleColumns={visibleColumns}
              numericColumns={["YearSem"]}
            />
          </div>
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center py-12">
            {loadingBacklogs ? (
              <Ring size={32} speed={1.5} stroke={4} color="var(--primary)" />
            ) : errors.getBacklogs || !Array.isArray(backlogs) ? (
              <div className="text-center space-y-4 p-4">
                <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
                <h3 className="text-2xl font-medium text-destructive">
                  
                </h3>
                <p className="text-destructive max-w-md">
                  {errors.getBacklogs}
                </p>
                <Button
                  variant={""}
                  size={""}
                  onClick={getBacklogs}
                  className="mt-4 gap-2"
                >
                  <RefreshCw />
                  Retry
                </Button>
              </div>
            ) : (
              <div>
                <ClipboardCheck className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No Backlogs Found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  You have cleared all your subjects. Great job!
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Backlogs;
