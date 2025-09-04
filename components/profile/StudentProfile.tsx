"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BookText,
    UserCircle,
    GraduationCap,
} from "lucide-react";

import { useStudentStore } from "@/stores/useStudentStore";

import Link from "next/link";
import ProfileSkeleton from "./ProfileSkeleton";
import { useAuthStore } from "@/stores/useAuthStore";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import ProfileError from "./ProfileError";
import EducationTab from "./EducationTab";
import PersonalTab from "./PersonalTab";
import AcademicTab from "./AcademicTab";
import ProfileDialog from "./ProfileDialog";

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

export function StudentProfile() {
    const [activeTab, setActiveTab] = useState(0);
    const {
        student,
        isFetchingProfile,
        fetchProfile,
        errors,
        loadAvatar,
        loadingAvatar,
        avatarBlobUrl,
    } = useStudentStore();
    const { authenticated } = useAuthStore();

    useEffect(() => {
        if (authenticated) {
            fetchProfile();
            loadAvatar();
        }
    }, [authenticated, fetchProfile, loadAvatar]);

    const TABS = [
        { id: 0, title: "Academic", icon: <GraduationCap className="h-4 w-4" /> },
        { id: 1, title: "Education", icon: <BookText className="h-4 w-4" /> },
        { id: 2, title: "Personal", icon: <UserCircle className="h-4 w-4" /> },
    ];

    if (isFetchingProfile) {
        return <ProfileSkeleton />;
    }

    if (errors.fetchProfile || !student) {
        return (
            <ProfileError description={errors.fetchProfile ?? undefined} onReload={()=>{
                fetchProfile();
                loadAvatar();
            }} />
        );
    }

    return (
        <div className="max-w-screen-lg mx-auto px-2 sm:px-4 md:px-6 py-2">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.1,
                        },
                    },
                }}
            >
                <motion.div variants={textVariants}>
                    <Card className="overflow-hidden">
                        {/* Profile Header */}
                        <CardHeader className="px-8 py-6">
                            <motion.div
                                className="flex flex-col md:flex-row items-center gap-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <ProfileDialog/>

                                <div className="text-center md:text-left space-y-2">
                                    <CardTitle className="text-3xl font-bold tracking-tight">
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            {student.StudentName}
                                        </motion.div>
                                    </CardTitle>
                                    <motion.div
                                        className="text-lg font-medium text-muted-foreground"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {student.Course}
                                    </motion.div>
                                    <motion.div
                                        className="flex flex-wrap justify-center md:justify-start gap-2 mt-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <Badge className="" variant="secondary">ID: {student.StudentID}</Badge>
                                        <Badge className="" variant={undefined}>Semester {student.YearSem}</Badge>
                                        <Badge className="" variant={undefined}>{student.Section}</Badge>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </CardHeader>

                        {/* Tab Navigation */}
                        <motion.div
                            className="border-b bg-muted/40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <div className="flex p-2 gap-2 justify-center">
                                {TABS.map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`rounded-md px-3 py-2 text-sm font-medium flex items-center gap-2 ${activeTab === tab.id
                                                ? "bg-background text-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 + tab.id * 0.1 }}
                                    >
                                        {tab.icon}
                                        {tab.title}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        <CardContent className="p-0">
                            <ScrollArea className="">
                                <AnimatePresence mode="wait">
                                    {activeTab === 0 && <AcademicTab />}
                                    {activeTab === 1 && <EducationTab />}
                                    {activeTab === 2 && <PersonalTab />}
                                </AnimatePresence>
                                <ScrollBar className="" orientation="horizontal" />
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
