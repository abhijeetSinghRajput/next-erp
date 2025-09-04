import { motion } from "framer-motion";
import Link from "next/link";
import { useStudentStore } from "@/stores/useStudentStore";

const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
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
        },
    },
    exit: {
        opacity: 0,
        x: -30,
        transition: {
            duration: 0.3,
        },
    },
};

const AcademicTab = () => {
    const { student } = useStudentStore();
    return (
        <motion.div
            key="academic"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-8"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    className="space-y-6"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    <motion.div variants={textVariants}>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                            Enrollment Details
                        </h3>
                        <dl className="space-y-4">
                            <motion.div
                                className="flex items-start"
                                variants={textVariants}
                            >
                                <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    Enrollment No
                                </dt>
                                <dd className="text-sm font-mono">
                                    {student?.EnrollmentNo}
                                </dd>
                            </motion.div>
                            <motion.div
                                className="flex items-start"
                                variants={textVariants}
                            >
                                <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    University Roll No
                                </dt>
                                <dd className="text-sm font-mono">
                                    {student?.PRollNo}
                                </dd>
                            </motion.div>

                            <motion.div
                                className="flex items-start"
                                variants={textVariants}
                            >
                                <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    Registration Id
                                </dt>
                                <dd className="text-sm font-mono">
                                    {student?.RegID}
                                </dd>
                            </motion.div>
                        </dl>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="space-y-6"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                                delayChildren: 0.2,
                            },
                        },
                    }}
                >
                    <motion.div variants={textVariants}>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">
                            Contact Information
                        </h3>
                        <dl className="space-y-4">
                            <motion.div
                                className="flex items-start"
                                variants={textVariants}
                            >
                                <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    Personal Email
                                </dt>
                                <dd className="text-sm">
                                    <Link
                                        href={`mailto:${student?.Email ?? ""}`}
                                        className="text-primary hover:underline"
                                    >
                                        {student?.Email?.toLowerCase()}
                                    </Link>
                                </dd>
                            </motion.div>
                            <motion.div
                                className="flex items-start"
                                variants={textVariants}
                            >
                                <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    University Email
                                </dt>
                                <dd className="text-sm">
                                    <Link
                                        href={`mailto:${student?.OfficialMailID ?? ""}`}
                                        className="text-primary hover:underline"
                                    >
                                        {student?.OfficialMailID}
                                    </Link>
                                </dd>
                            </motion.div>
                        </dl>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default AcademicTab;