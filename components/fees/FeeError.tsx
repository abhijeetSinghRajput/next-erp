import React from "react";
import TableError from "../table/TableError";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { FileTextIcon, HomeIcon, WalletIcon } from "lucide-react";

const FeeError = (props : any) => {
  return (
    <div className="max-w-screen-lg mx-auto px-2 sm:px-4 md:px-6 py-2">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">Fee Submissions</h2>

      <Tabs defaultValue="course" className="w-full">
        <TabsList className="grid w-full h-10 grid-cols-3 max-w-xs">
          <TabsTrigger value="course" className="h-full">
            Course Fees
          </TabsTrigger>
          <TabsTrigger value="hostel" className="h-full">
            Hostel Fees
          </TabsTrigger>
          <TabsTrigger value="receipts" className="h-full">
            Receipts Fees
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <TableError {...props} className={"px-0 sm:px-0 md:px-0"} description="We couldn't load the fee records. Please check your connection and try again." />
    </div>
  );
};

export default FeeError;
