import toast from "react-hot-toast";

export function clampTextToLimit(
  value: string,
  maxLength: number,
  message: string,
  toastId?: string
) {
  if (value.length <= maxLength) {
    return value;
  }

  toast.error(message, { id: toastId ?? message });
  return value.slice(0, maxLength);
}

export function isTextOverLimit(
  value: string,
  maxLength: number,
  message: string,
  toastId?: string
) {
  if (value.length <= maxLength) {
    return false;
  }

  toast.error(message, { id: toastId ?? message });
  return true;
}
