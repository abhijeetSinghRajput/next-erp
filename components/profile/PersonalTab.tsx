import { motion } from "framer-motion";
import { Phone, Cake, WalletCards, Home } from "lucide-react";
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

const PersonalTab = () => {
    const { student } = useStudentStore();
    return (
        <motion.div
            key="personal"
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
                        <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">
                            Personal Details
                        </h3>
                        <dl className="space-y-4">
                            <motion.div
                                className="flex items-start"
                                variants={textVariants}
                            >
                                <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Mobile
                                    </div>
                                </dt>
                                <dd className="text-sm">{student?.MobileNO}</dd>
                            </motion.div>

                            {student?.AlternateMobileNO && (
                                <motion.div
                                    className="flex items-start"
                                    variants={textVariants}
                                >
                                    <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Alternate Mobile
                                        </div>
                                    </dt>
                                    <dd className="text-sm">
                                        {student?.AlternateMobileNO}
                                    </dd>
                                </motion.div>
                            )}

                            <motion.div
                                className="flex items-start"
                                variants={textVariants}
                            >
                                <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Cake className="h-4 w-4" />
                                        Date of Birth
                                    </div>
                                </dt>
                                <dd className="text-sm">{student?.DOB}</dd>
                            </motion.div>

                            <motion.div
                                className="flex items-start"
                                variants={textVariants}
                            >
                                <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <WalletCards className="h-4 w-4" />
                                        ABC Account
                                    </div>
                                </dt>
                                <dd className="text-sm">
                                    {student?.ABCAccountNo}
                                </dd>
                            </motion.div>

                            <motion.div
                                className="flex items-start"
                                variants={textVariants}
                            >
                                <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Home className="h-4 w-4" />
                                        Address
                                    </div>
                                </dt>
                                <dd className="text-sm">{student?.PAddress}</dd>
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
                        <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">
                            Family Details
                        </h3>
                        <dl className="space-y-4">
                            <motion.div
                                className="flex items-start"
                                variants={textVariants}
                            >
                                <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    Father&apos;s Name
                                </dt>
                                <dd className="text-sm">
                                    {student?.FatherHusName}
                                </dd>
                            </motion.div>

                            <motion.div
                                className="flex items-start"
                                variants={textVariants}
                            >
                                <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    Father&apos;s Mobile
                                </dt>
                                <dd className="text-sm">{student?.FMobileNo}</dd>
                            </motion.div>

                            <motion.div
                                className="flex items-start"
                                variants={textVariants}
                            >
                                <dt className="w-40 flex-shrink-0 text-sm font-medium text-muted-foreground">
                                    Mother&apos;s Name
                                </dt>
                                <dd className="text-sm">
                                    {student?.MotherName}
                                </dd>
                            </motion.div>
                        </dl>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>)
};

export default PersonalTab;