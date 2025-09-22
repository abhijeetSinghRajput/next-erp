"use client";

import { cn, formatRelativeDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useNoticeStore, type Circular } from "@/stores/useNoticeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import CircularSkeleton from "./CircularSkeleton";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Search, X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import CircularError from "./CircularError";

interface IconConfig {
    icon: string;
    color: string;
}

interface IconsMap {
    [key: string]: IconConfig;
}

const icons: IconsMap = {
    "Information Cell": { icon: "🗞️", color: "#1e86ff" },
    "Fee Cell": { icon: "💸", color: "#00c9a7" },
    "Examination Cell": { icon: "🎓", color: "#f9a825" },
};

type SortOption = "newest" | "oldest" | "department";

const CircularDetailsDrawer: React.FC = () => {
    const { isLoadingCircularDetails, allCirculars, getAllCirculars } =
        useNoticeStore();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortOption, setSortOption] = useState<SortOption>("newest");
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    // Automatically cycle through circulars
    useEffect(() => {
        if (allCirculars.length <= 3) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % allCirculars.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [allCirculars.length]);

    const visibleCirculars: Circular[] = useMemo(() => {
        if (allCirculars.length <= 3) return allCirculars;

        const items: Circular[] = [];
        for (let i = 0; i < 3; i++) {
            const circular = allCirculars[(currentIndex + i) % allCirculars.length];
            if (circular) items.push(circular);
        }
        return items;
    }, [currentIndex, allCirculars]);

    const filteredAndSortedCirculars: Circular[] = useMemo(() => {
        let result: Circular[] = [...allCirculars];

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (circular) =>
                    circular.Subject.toLowerCase().includes(term) ||
                    circular.Notice.toLowerCase().includes(term) ||
                    (circular.ByDepartment &&
                        circular.ByDepartment.toLowerCase().includes(term))
            );
        }

        // Sort
        switch (sortOption) {
            case "newest":
                result.sort(
                    (a, b) =>
                        new Date(b.DateFrom).getTime() - new Date(a.DateFrom).getTime()
                );
                break;
            case "oldest":
                result.sort(
                    (a, b) =>
                        new Date(a.DateFrom).getTime() - new Date(b.DateFrom).getTime()
                );
                break;
            case "department":
                result.sort((a, b) => a.ByDepartment.localeCompare(b.ByDepartment));
                break;
        }

        return result;
    }, [allCirculars, searchTerm, sortOption]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (value: string): void => {
        setSortOption(value as SortOption);
    };

    const clearSearch = (): void => {
        setSearchTerm("");
    };

    return (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
                <Button size="" variant="secondary" className={""}>View All Notices</Button>
            </DrawerTrigger>
            <DrawerContent className="h-[80vh]">
                <ScrollArea className={"overflow-y-auto"}>
                    <div className="max-w-screen-lg mx-auto p-2 sm:p-6">
                        <DrawerHeader className={""}>
                            <DrawerTitle className="text-2xl">
                                All Notices & Circulars
                            </DrawerTitle>
                        </DrawerHeader>

                        <div className="flex flex-col sm:flex-row gap-4 mb-6 sticky p-4 top-0 bg-background z-10">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search notices..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={handleSearchChange} type={undefined} />
                                {searchTerm && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                                        onClick={clearSearch}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <Select
                                value={sortOption}
                                onValueChange={handleSortChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent className={""}>
                                    <SelectItem className={""} value="newest">Newest First</SelectItem>
                                    <SelectItem className={""} value="oldest">Oldest First</SelectItem>
                                    <SelectItem className={""} value="department">By Department</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            {isLoadingCircularDetails ? (
                                <CircularSkeleton />
                            ) : !allCirculars.length ? (
                                <CircularError onReload={getAllCirculars} />
                            ) : filteredAndSortedCirculars.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No notices found matching your criteria
                                </div>
                            ) : (
                                filteredAndSortedCirculars.map((circular) => (
                                    <motion.div
                                        key={circular.CirID}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="w-full rounded-xl gap-0">
                                            <CardHeader className="flex pb-4 gap-2 flex-row items-start">
                                                <div
                                                    className="aspect-square size-12 rounded-xl text-2xl flex items-center justify-center"
                                                    style={{
                                                        background:
                                                            icons[circular.ByDepartment]?.color || "#ffb800",
                                                    }}
                                                >
                                                    {icons[circular.ByDepartment]?.icon || "📢"}
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <CardTitle className="line-clamp-2">
                                                        {circular.Subject}
                                                    </CardTitle>
                                                    <div className="text-sm flex gap-2 flex-wrap text-muted-foreground">
                                                        <span>{formatRelativeDate(circular.DateFrom)}</span>
                                                        <Badge variant="secondary" className={undefined}>
                                                            {circular.EmployeeName}
                                                        </Badge>
                                                        {circular.DateTo && (
                                                            <Badge variant="border" className={"text-foreground"}>
                                                                Valid until: {circular.DateTo}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className={undefined}>
                                                <div
                                                    className="prose prose-sm max-w-none text-muted-foreground"
                                                    dangerouslySetInnerHTML={{
                                                        __html: (() => {
                                                            try {
                                                                const decoded = decodeURIComponent(
                                                                    circular.Notice
                                                                );
                                                                return decoded.replace(/\n/g, "<br />");
                                                            } catch {
                                                                return circular.Notice.replace(/\n/g, "<br />");
                                                            }
                                                        })(),
                                                    }}
                                                />
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
};

export default CircularDetailsDrawer;
