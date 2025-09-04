"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ModeToggle } from "./ui/mode-toggle";
import { useTheme } from "next-themes";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { Loader2, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";
import TooltipWrapper from "./TooltipWrapper";

const Header = () => {
    const { theme } = useTheme();
    const { logout, authenticated, loginingOut } = useAuthStore();
    const [githubStarsCount, setGithubStarsCount] = useState(0);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const getGithubStarCount = async () => {
            try {
                const { data } = await axios.get(
                    "https://api.github.com/repos/abhijeetsinghrajput/geu-erp"
                );
                setGithubStarsCount(data.stargazers_count);
            } catch (error) {
                console.error("Error fetching GitHub stars:", error);
            }
        };
        getGithubStarCount();
    }, []);

    const isDark = mounted ? theme === "dark" : false;
    const logo = isDark ? "/graphic-era-light.svg" : "/graphic-era-dark.svg";
    const githubLogo = isDark ? "/github-mark-white.svg" : "/github-mark.svg";

    const lastScrollY = useRef(0);
    const y = useMotionValue(0);
    const opacity = useTransform(y, [0, -60], [1, 0]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollDirection = currentScrollY > lastScrollY.current ? "down" : "up";

            if (scrollDirection === "down") animate(y, -60, { duration: 0.3 });
            else animate(y, 0, { duration: 0.3 });

            lastScrollY.current = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [y]);

    const handleGithubClick = () => window.open("https://github.com/abhijeetsinghrajput/geu-erp", "_blank");

    return (
        <motion.nav
            style={{ y, opacity }}
            className="flex sticky shadow-sm top-0 left-0 w-full border-b px-4 sm:px-6 bg-background z-50 justify-between items-center h-14 p-2"
        >
            <TooltipWrapper content={"go to homepage"}>
                <Link href="/" className="flex items-center gap-2 h-full">
                    <div className="h-full p-1 relative w-12">
                        <Image
                            src="/geu-logo.png"
                            alt="GEU Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="w-32 relative h-6">
                        <Image
                            src={logo}
                            alt="Graphic Era Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>
            </TooltipWrapper>

            <div className="flex gap-1 items-center">
                <TooltipWrapper content="Rate us on Github">
                    <Button size="sm" variant="ghost" onClick={handleGithubClick} className={""}>
                        {githubStarsCount}
                        <div className="size-5 text-base relative w-5 h-5 ml-1">
                            <Image
                                src={githubLogo}
                                alt="GitHub Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Button>
                </TooltipWrapper>

                <ModeToggle />

                {authenticated && (
                    <TooltipWrapper content="Logout account">
                        <Button variant="ghost" onClick={logout} className="size-8" size={""}>
                            {loginingOut ? <Loader2 className="animate-spin" /> : <LogOut />}
                        </Button>
                    </TooltipWrapper>
                )}
            </div>
        </motion.nav>
    );
};

export default Header;
