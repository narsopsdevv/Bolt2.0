import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

export function isString(str) {
  return typeof str === 'string';
}

export function isNumber(num) {
  return typeof num === 'number';
}

export function isBoolean(bool) {
  return typeof bool === 'boolean';
}

export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
