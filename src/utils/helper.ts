import { OptionType } from "@/types/utilsType";
import clsx, { ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createOptions<T>(
  arr: T[],
  keyValue: keyof T,
  keyLabel: keyof T
): OptionType[] {
  return arr.map((item) => ({
    value: item[keyValue] as string,
    label: item[keyLabel] as string,
  }));
}

export function getCurrentAge(birthdate: Date): string {
  const birthdateDayjs = dayjs(birthdate);
  const currentDate = dayjs();

  const age = currentDate.diff(birthdateDayjs, "year");
  return `${age} ปี`;
}
