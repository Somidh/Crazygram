import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// export function formatDate(dateString: string) {
//   const options: Intl.DateTimeFormatOptions = {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   };

//   const date = new Date(dateString);
//   const formattedDate = date.toLocaleDateString("en-US", options);

//   const time = date.toLocaleTimeString([], {
//     hour: "numeric",
//     minute: "2-digit",
//   });

//   return `${formattedDate} at ${time}`;
// }

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  // Calculate the difference in milliseconds
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays >= 7) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  } else {
    return `Just now`;
  }
}

export const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});
