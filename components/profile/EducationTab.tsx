import { motion } from "framer-motion";
import { useStudentStore } from "@/stores/useStudentStore";
import { Progress } from "../ui/progress";

const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

const tabContentVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: "easeInOut",
        },
    },
    exit: {
        opacity: 0,
        x: -30,
        transition: {
            duration: 0.3,
            ease: "easeIn",
        },
    },
};

const EducationTab = () => {
    const { student } = useStudentStore();
    return (
        <motion.div
            key="education"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-8"
        >
            <div className="space-y-8">
                <motion.div variants={textVariants}>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">
                        Academic Performance
                    </h3>
                    <div className="space-y-6">
                        <motion.div variants={textVariants}>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">
                                    10th Grade
                                </span>
                                <span className="text-sm font-medium">
                                    {student?.["10"]}%
                                </span>
                            </div>
                            <Progress value={Number(student?.["10"] ?? 0)} />
                        </motion.div>

                        <motion.div variants={textVariants}>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">
                                    12th Grade
                                </span>
                                <span className="text-sm font-medium">
                                    {student?.["10+2"]}%
                                </span>
                            </div>
                            <Progress value={Number(student?.["10+2"] ?? 0)} />
                        </motion.div>

                        <motion.div variants={textVariants}>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">
                                    Graduation
                                </span>
                                <span className="text-sm font-medium">
                                    {student?.Graduation}%
                                </span>
                            </div>
                            <Progress value={Number(student?.Graduation ?? 0)} />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
};

export default EducationTab;