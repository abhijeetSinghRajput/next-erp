import { Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import CircularProgress from "../ui/circular-progress";
import { Button } from "../ui/button";
import TooltipWrapper from "../TooltipWrapper";
import { useExamStore, type ExamSummaryItem } from "../../stores/useExamStore";
import { Ring } from "ldrs/react";

interface ResultProps {
  examSummary: ExamSummaryItem[];
}

const Result: React.FC<ResultProps> = ({ examSummary }) => {
  const { loadingMarksheet, downloadMarksheet } = useExamStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
      className="space-y-4"
    >
      {examSummary.map((exam, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-3xl gap-0 py-0">
            <CardHeader className="pb-0 justify-between pt-6 items-center flex">
              <div className="flex gap-2 items-center">
                <CardTitle className="text-lg">
                  Year/Sem {exam.YearSem}
                </CardTitle>
                <Badge
                  className={""}
                  variant={exam.Result === "Fail" ? "destructive" : "default"}
                >
                  {exam.Result}
                </Badge>
              </div>
              <TooltipWrapper content="Download Marksheet">
                <Button
                  variant={""}
                  size={""}
                  className="size-8 p-0"
                  disabled={loadingMarksheet === exam.YearSem}
                  onClick={() => downloadMarksheet(exam.YearSem)}
                >
                  {loadingMarksheet === exam.YearSem ? (
                    <Ring
                      size={16}
                      speed={1.5}
                      stroke={2}
                      color="var(--primary-foreground)"
                    />
                  ) : (
                    <Download />
                  )}
                </Button>
              </TooltipWrapper>
            </CardHeader>
            <CardContent className="flex p-6 justify-between items-start">
              <div>
                {/* Exam Details */}
                <div className="">
                  <div className="flex gap-2 items-center">
                    <p className="text-muted-foreground">Subjects</p>
                    <p className="font-medium text-xl ">{exam.TotalSubject}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-muted-foreground">Backlogs</p>
                    <p className="font-medium text-xl ">{exam.TotalBack}</p>
                  </div>
                </div>
              </div>

              <CircularProgress
                value={exam.percnt}
                maxValue={10}
                label={exam.percnt}
                subLabel={exam.Marks}
              />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Result;
