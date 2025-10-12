"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, validateLoginForm } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  ShieldCheck,
  User2,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Ring } from "ldrs/react";
import ExpandableSwitch from "@/components/ExpandableSwitch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import OGMeta from "@/components/OGMeta";

interface LoginProps {
  className?: string;
}
const LoginPage = ({ className, ...props }: LoginProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { captchaImage, loadingCaptcha, getCaptcha, loggingIn, login } =
    useAuthStore();

  const [formData, setFormData] = useState({
    studentId: "",
    password: "",
    captcha: "",
  });
  const [errors, setErrors] = useState({
    studentId: "",
    password: "",
    captcha: "",
    form: "",
  });

  useEffect(() => {
    getCaptcha();
  }, [getCaptcha]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error for this field when typing
    setErrors((prev) => ({ ...prev, [e.target.id]: "", form: "" }));
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLoginForm(formData, setErrors)) return;
    const result = await login(formData);
    if (result) router.replace("/");
  };

  return (
    <>
      <OGMeta
        title="GEU ERP Login - Graphic Era University"
        description="Login to your Graphic Era University ERP dashboard to access attendance, fees, and exam results securely."
        url="https://geu-erp.vercel.app/login"
        image="https://geu-erp.vercel.app/og/loginpage.png"
        imageAlt="GEU ERP Login Page Preview"
      />

      <div className="h-svh">
        <Header />
        <div className="max-w-md p-4 mx-auto flex items-center justify-center mt-8">
          <div
            className={cn("flex flex-col gap-6 w-full", className)}
            {...props}
          >
            <form onSubmit={handleLogin}>
              {/* Display form-level error */}
              {errors.form && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                  {errors.form}
                </div>
              )}

              <div className="flex flex-col gap-6">
                {/* University logo and title... */}
                <div className="flex flex-col items-center gap-2">
                  <h1 className="text-xl font-bold">
                    Welcome to{" "}
                    <span className="text-red-500 font-serif">Graphic Era</span>
                  </h1>
                  <div>
                    <ExpandableSwitch />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Student ID Field */}
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="studentId" className={undefined}>
                        Student Id
                      </Label>
                      <Link
                        href={"/forgot-id"}
                        className="text-sm text-muted-foreground font-medium underline-offset-4 hover:underline"
                      >
                        Forgot your id?
                      </Link>
                    </div>
                    <div className="relative rounded-md">
                      <span className="absolute top-0 text-muted-foreground h-full border-r left-0 flex items-center justify-center w-8">
                        <User2 className="size-5" />
                      </span>
                      <Input
                        type={"text"}
                        id="studentId"
                        value={formData.studentId}
                        onChange={handleInput}
                        placeholder="Enter your Student Id"
                        className={`h-11 rounded-lg focus-visible:ring-2 pl-9 bg-input/30 ${
                          errors.studentId ? "ring-2 ring-destructive" : ""
                        }`}
                      />
                    </div>
                    {errors.studentId && (
                      <p className="text-red-500 text-xs">{errors.studentId}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className={undefined}>
                        Password
                      </Label>
                      <Link
                        href={"/forgot-password"}
                        className="text-sm text-muted-foreground font-medium underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <div className="relative rounded-md">
                      <span className="absolute top-0 text-muted-foreground h-full border-r left-0 flex items-center justify-center w-8">
                        <Lock className="size-5" />
                      </span>
                      <Input
                        id="password"
                        value={formData.password}
                        type={showPassword ? "text" : "password"}
                        onChange={handleInput}
                        placeholder="Enter your password"
                        className={`h-11 rounded-lg focus-visible:ring-2 pl-9 pr-11 bg-input/30 ${
                          errors.password ? "ring-2 ring-destructive" : ""
                        }`}
                      />
                      <Button
                        size={"default"}
                        type="button"
                        variant="ghost"
                        className="text-muted-foreground rounded-l-none h-full absolute top-0 right-0"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <Eye /> : <EyeOff />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs">{errors.password}</p>
                    )}
                  </div>

                  {/* Captcha Field */}
                  <div className="grid gap-2">
                    {loadingCaptcha ? (
                      <Skeleton className={"h-14 rounded-none"} />
                    ) : (
                      <Avatar className="h-14 rounded-none border w-full bg-white mx-auto">
                        <AvatarImage
                          className="w-full h-full object-contain"
                          src={captchaImage}
                          alt="captchaImage"
                        />
                        <AvatarFallback className="text-sm flex gap-2 items-center font-medium text-muted-foreground/50 rounded-none w-full h-full">
                          Failed To Load Captcha
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="relative rounded-md">
                      <span className="absolute top-0 text-muted-foreground h-full border-r left-0 flex items-center justify-center w-8">
                        <ShieldCheck className="size-5" />
                      </span>
                      <Input
                        type={"text"}
                        id="captcha"
                        value={formData.captcha}
                        onChange={handleInput}
                        placeholder="Fill the Captcha"
                        disabled={loadingCaptcha || !captchaImage}
                        autoComplete="off"
                        className={`h-11 rounded-lg focus-visible:ring-2 pl-9 pr-11 bg-input/30 ${
                          errors.captcha ? "ring-2 ring-destructive" : ""
                        }`}
                      />
                      <Button
                        size={"default"}
                        type="button"
                        variant="ghost"
                        className="text-muted-foreground rounded-l-none h-full absolute top-0 right-0"
                        onClick={getCaptcha}
                        disabled={loadingCaptcha}
                      >
                        <RefreshCw
                          className={loadingCaptcha ? "animate-spin" : ""}
                        />
                      </Button>
                    </div>
                    {errors.captcha && (
                      <p className="text-red-500 text-xs">{errors.captcha}</p>
                    )}
                  </div>

                  <Button
                    variant={"default"}
                    size={"default"}
                    type="submit"
                    disabled={loadingCaptcha || loggingIn || !captchaImage}
                    className="w-full h-11 rounded-lg"
                  >
                    Login
                    {loggingIn && (
                      <Ring
                        size={16}
                        speed={1.5}
                        stroke={2}
                        color="var(--primary-foreground)"
                      />
                    )}
                  </Button>
                </div>
              </div>
            </form>

            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
              By clicking continue, you agree to our{" "}
              <Link
                href={"/policy"}
                className="text-muted-foreground font-medium underline-offset-4 underline"
              >
                Privacy Policy
              </Link>
            </div>
            <blockquote className="text-sm text-muted-foreground bg-input/30 border-l-2 p-2 rounded-md overflow-hidden border-accent pl-4 italic">
              “The portal does not store any credentials and is fully
              open-source. You can verify our security practices by reviewing
              the source code.”
              <a
                href="https://github.com/abhijeetSinghRajput/geu-erp"
                target="_blank"
                className="inline-flex items-center gap-1 underline underline-offset-4 text-primary font-medium ml-1"
              >
                github
                <ExternalLink size={14} />
              </a>
            </blockquote>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
