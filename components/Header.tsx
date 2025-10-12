import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Lock,
  LogOut,
  Moon,
  Settings,
  Sun,
  User2,
  UserRoundSearch,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";
import TooltipWrapper from "./TooltipWrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCookieStore } from "../stores/useCookieStore";
import { Ring } from "ldrs/react";
import { Button } from "./ui/button";
import { ThemeToggleButton, useThemeToggle } from "./ui/skipperTheme";
import Image from "next/image";
import Notification from "./Notification";
import Github from "./Github";

const Header = ({ children }: { children?: React.ReactNode }) => {
  const { isDark, toggleTheme } = useThemeToggle({
    variant: "circle",
    start: "top-right",
    blur: false,
    gifUrl: "",
  });
  const [githubStarsCount, setGithubStarsCount] = useState(0);
  const { logout, loginingOut, authenticated } = useAuthStore();
  const { campus } = useCookieStore();

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

  const logo = isDark ? "/graphic-era-light.svg" : "/graphic-era-dark.svg";

  const lastScrollY = useRef(0);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, -60], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection =
        currentScrollY > lastScrollY.current ? "down" : "up";

      animate(y, scrollDirection === "down" ? -60 : 0, { duration: 0.3 });
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [y]);

  const handleGithubClick = () =>
    window.open("https://github.com/abhijeetsinghrajput/geu-erp", "_blank");

  return (
    <motion.nav
      style={{ y, opacity }}
      className="flex sticky shadow-sm top-0 left-0 w-full border-b  bg-background z-50 justify-between items-center h-14"
    >
      <div className="max-w-screen-lg w-full flex justify-between items-center mx-auto h-full p-2 px-2 sm:px-4 md:px-6">
        {/* Logo */}
        <TooltipWrapper content="Go to homepage">
          <Link href="/" className="flex items-center gap-0 h-full">
            <div className="h-full p-1">
              <Image
                src={
                  campus === "hill"
                    ? "/gehu-circular-logo.png"
                    : "/geu-circular-logo.png"
                }
                alt="Graphic Era University Logo"
                width={50} // adjust as needed
                height={50} // adjust as needed
                className="object-contain w-full h-full"
              />
            </div>
            <div className="w-28 sm:w-32">
              <Image
                src={logo} // make sure this is a valid path or external URL
                alt="Graphic Era Logo"
                width={128} // adjust according to your design
                height={32} // adjust according to your design
                className="object-contain w-full h-full"
              />
            </div>
          </Link>
        </TooltipWrapper>

        {/* Right section */}
        <div className="flex gap-1 items-center">
          <TooltipWrapper content="Star us on GitHub">
            <Button
              variant="ghost"
              onClick={handleGithubClick}
              className="px-2.5"
              size={undefined}
            >
              {githubStarsCount}

              <Github/>
            </Button>
          </TooltipWrapper>

          <ThemeToggleButton start="top-right" />
          {authenticated && <Notification variant={undefined} className={""} />}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className={undefined}>
                {loginingOut ? (
                  <Ring
                    size={16}
                    speed={1.5}
                    stroke={2}
                    color="var(--foreground)"
                  />
                ) : (
                  <Settings />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="min-w-40" align="end">
              {/* Privacy Policy */}
              <DropdownMenuItem asChild className={undefined} inset={undefined}>
                <Link
                  href="/forgot-id"
                  className="flex items-center gap-2 w-full"
                >
                  <UserRoundSearch />
                  <span>Forgot ID</span>
                </Link>
              </DropdownMenuItem>

              {/* Privacy Policy */}
              <DropdownMenuItem asChild className={undefined} inset={undefined}>
                <Link
                  href="/forgot-password"
                  className="flex items-center gap-2 w-full"
                >
                  <Lock />
                  <span>Forgot Password</span>
                </Link>
              </DropdownMenuItem>

              {/* Docs */}
              <DropdownMenuItem asChild className={undefined} inset={undefined}>
                <Link href="/docs" className="flex items-center gap-2 w-full">
                  <BookOpen />
                  <span>Docs</span>
                </Link>
              </DropdownMenuItem>

              {/* Privacy Policy */}
              <DropdownMenuItem asChild className={undefined} inset={undefined}>
                <Link href="/policy" className="flex items-center gap-2 w-full">
                  <FileText />
                  <span>Privacy Policy</span>
                </Link>
              </DropdownMenuItem>

              {/* Logout */}
              {authenticated && (
                <>
                  <DropdownMenuSeparator className="bg-input" />
                  <DropdownMenuItem
                    onClick={logout}
                    disabled={loginingOut}
                    className="text-destructive hover:bg-destructive/20 flex items-center gap-2"
                    inset={undefined}
                  >
                    {loginingOut ? (
                      <Ring
                        size={16}
                        speed={1.5}
                        stroke={2}
                        color="var(--destructive)"
                      />
                    ) : (
                      <LogOut className="text-destructive" />
                    )}
                    <span>Logout</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {children}
        </div>
      </div>
    </motion.nav>
  );
};

export default Header;
