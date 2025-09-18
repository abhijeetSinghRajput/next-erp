"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "../../lib/utils";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import validator from "validator";
import { format } from "date-fns";
import { useStudentStore } from "../../stores/useStudentStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCookieStore } from "../../stores/useCookieStore";
import { Ring } from "ldrs/react";
import Image from "next/image";

interface ForgotIdPageProps {
  className?: string;
}

interface FormData {
  email: string;
  DOB: string;
}

interface Errors {
  email: string;
}

interface AlertState {
  type: "error" | "success" | "";
  message: string;
}

const ForgotIdPage: React.FC<ForgotIdPageProps> = ({ className, ...props }) => {
  const { campus } = useCookieStore();
  const { getStudentId, requestingID } = useStudentStore();

  const [formData, setFormData] = useState<FormData>({ email: "", DOB: "" });
  const [errors, setErrors] = useState<Errors>({ email: "" });
  const [alert, setAlert] = useState<AlertState>({ type: "", message: "" });
  const [date, setDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setErrors((prev) => ({ ...prev, [e.target.id]: "" }));
    setAlert({ type: "", message: "" });
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors: Errors = { email: "" };
    let isValid = true;

    // Email validation
    if (validator.isEmpty(formData.email.trim())) {
      newErrors.email = "Please insert registered Email-ID";
      isValid = false;
    } else if (!validator.isEmail(formData.email.trim())) {
      newErrors.email = "Invalid Email format";
      isValid = false;
    }

    // DOB validation
    if (!formData.DOB) {
      setAlert({
        type: "error",
        message: "Please insert registered Date of Birth",
      });
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    const result = await getStudentId(formData);

    if (result === 1) {
      setAlert({
        type: "success",
        message:
          "We have sent your ERP User ID to your registered email address.",
      });
    } else if (result === 2) {
      setAlert({
        type: "error",
        message:
          "Given information is not valid, please update it on ERP and try again.",
      });
    } else {
      setAlert({
        type: "success",
        message:
          "Please check your registered Email (Inbox/Spam) to reset password.",
      });
      setFormData({ email: "", DOB: "" });
      setDate(null);
    }
  };

  return (
    <div className="h-svh">
      <Header />
      <div className="max-w-md p-4 mx-auto flex items-center justify-center mt-8">
        <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                {alert.message ? (
                  <Alert
                    variant={alert.type === "error" ? "destructive" : "default"}
                    className="mb-4"
                  >
                    {alert.type === "error" ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    <AlertTitle className={"text-base"}>
                      {alert.type === "error" ? "Error" : "Success"}
                    </AlertTitle>
                    <AlertDescription className={undefined}>
                      {alert.message}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <a
                    href="#"
                    className="flex flex-col items-center gap-2 font-medium"
                  >
                    <div className="flex items-center justify-center rounded-md relative w-24 h-24">
                      <Image
                        height={96}
                        width={96}
                        src={
                          campus === "hill"
                            ? "/gehu-circular-logo.png"
                            : "/geu-circular-logo.png"
                        }
                        alt="University Logo"
                        className="object-contain"
                      />
                    </div>
                  </a>
                )}
                <h1 className="text-xl font-bold">FORGOT ID</h1>
              </div>

              <div className="flex flex-col gap-4">
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className={undefined}>
                    Email
                  </Label>
                  <div className="relative rounded-md">
                    <span className="absolute top-0 text-muted-foreground h-full border-r left-0 flex items-center justify-center w-8">
                      <Mail className="size-5" />
                    </span>
                    <Input
                      id="email"
                      value={formData.email}
                      type="email"
                      onChange={handleInput}
                      placeholder="Enter your email"
                      className={`h-11 rounded-lg focus-visible:ring-2 px-9 bg-input/30 ${
                        errors.email ? "ring-2 ring-destructive" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>

                {/* DOB */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="DOB" className="px-1">
                    Date of birth
                  </Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="DOB"
                        className="justify-between font-normal w-full h-11 bg-input/30"
                        size={undefined}
                      >
                        {formData.DOB || "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date ?? undefined}
                        captionLayout="dropdown"
                        className="bg-card"
                        onSelect={(selected: Date | undefined) => {
                          if (selected) {
                            setDate(selected);
                            setFormData((prev) => ({
                              ...prev,
                              DOB: format(selected, "dd/MM/yyyy"),
                            }));
                            setOpen(false);
                          }
                        }}
                        classNames={undefined}
                        formatters={undefined}
                        components={undefined}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-lg"
                  disabled={requestingID}
                  variant={undefined}
                  size={undefined}
                >
                  {requestingID ? (
                    <>
                      <Ring
                        size={20}
                        speed={1.5}
                        stroke={2}
                        color="hsl(var(--primary-foreground))"
                      />
                      Please wait...
                    </>
                  ) : (
                    "Request ID"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotIdPage;
