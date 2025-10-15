import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, InfoIcon } from "lucide-react";
import React, { useState } from "react";
import DataTable from "../table/DataTable";
import FeeError from "./FeeError";
import { useFeeStore, type FeeHeadData } from "@/stores/useFeeStore";
import FeeSkeleton from "./FeeSkeleton";
import TableError from "../table/TableError";

interface CourseFeeProps {
  data: FeeHeadData[];
  totals: {
    DueAmount: number;
    ReceivedAmount: number;
    BalanceAmount: number;
    SCAmount: number;
    SecurityAdjusted: number;
  };
  columns: Array<{
    id: string;
    header: string;
    sortable: boolean;
    prefix?: string;
  }>;
}

const CourseFee: React.FC<CourseFeeProps> = ({ data, totals, columns }) => {
  const { getFeeSubmissions, errors, loadingFeeSubmissions } = useFeeStore();
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      FeeHead: true,
      DueAmount: true,
      ReceivedAmount: true,
      BalanceAmount: true,
      status: true,
    }
  );

  // loading and error handling
  if (loadingFeeSubmissions) {
    return <FeeSkeleton className={"mt-0"} />;
  }

  if (errors.getFeeSubmissions || !Array.isArray(data)) {
    return (
      <TableError
        heading="Failed to load Fees"
        className={"px-0 sm:px-0 md:px-0"}
        description={errors.getFeeSubmissions || undefined}
        onReload={getFeeSubmissions}
      />
    );
  }

  const toggleColumnVisibility = (columnId: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  return (
    <Card className="rounded-2xl overflow-hidden py-0 gap-0">
      <CardHeader className="border bg-muted p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="">Course Fee Details</CardTitle>
            <CardDescription className="">
              {data[0]?.YS || "Current Year"} Fee Breakdown
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge
              variant={totals.BalanceAmount > 0 ? "destructive" : "success"}
              className=""
            >
              {totals.BalanceAmount > 0 ? "Pending" : "Paid"}
            </Badge>
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
                {columns.map((column: any) => (
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
        {data.length > 0 ? (
          <div className="space-y-6">
            <DataTable
              data={data}
              columns={columns}
              visibleColumns={visibleColumns}
              footerData={{
                FeeHead: "Total",
                DueAmount: totals.DueAmount,
                ReceivedAmount: totals.ReceivedAmount,
                BalanceAmount: totals.BalanceAmount,
                status: totals.BalanceAmount > 0 ? "Pending" : "Paid",
              }}
              numericColumns={["DueAmount", "ReceivedAmount", "BalanceAmount"]}
              statusConfig={{
                accessor: "status",
                validator: (row) => {
                  return row.BalanceAmount > 0
                    ? { value: "Pending", variant: "destructive" }
                    : { value: "Paid", variant: "success" };
                },
              }}
            />
          </div>
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center py-12">
            <InfoIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No Course Fees Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There are no course fees associated with your account.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseFee;
