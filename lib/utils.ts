import { clsx } from "clsx";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInWeeks, differenceInYears, parse } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: (string | boolean | undefined)[]) {
  return twMerge(clsx(inputs));
}

type LoginFormData = {
  studentId: string;
  password: string;
  captcha: string;
}

type LoginFormError = {
  studentId: string;
  password: string;
  captcha: string;
  form: string;
};


export const validateLoginForm = (
  formData: LoginFormData, 
  onError: (errors: LoginFormError) => void
) => {
  let valid = true;
  const newErrors = {
    studentId: "",
    password: "",
    captcha: "",
    form: "",
  };

  if (!formData.studentId.trim()) {
    newErrors.studentId = "Student ID is required";
    valid = false;
  }

  if (!formData.password.trim()) {
    newErrors.password = "Password is required";
    valid = false;
  }

  if (!formData.captcha.trim()) {
    newErrors.captcha = "Captcha is required";
    valid = false;
  }

  onError(newErrors);
  return valid;
};

export const formatRelativeDate = (date : string) : string => {
  try {
    // Parse the date string in dd/MM/yyyy format
    const parsedDate = parse(date, "dd/MM/yyyy", new Date());
    const now = new Date();

    const minutes = differenceInMinutes(now, parsedDate);
    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = differenceInHours(now, parsedDate);
    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = differenceInDays(now, parsedDate);
    if (days < 7) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    const weeks = differenceInWeeks(now, parsedDate);
    if (weeks < 4) {
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    }

    const months = differenceInMonths(now, parsedDate);
    if (months < 12) {
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    }

    const years = differenceInYears(now, parsedDate);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return date; // Return the original string if formatting fails
  }
};
