"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

type DateRangePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toInputDate(value: string) {
  const normalized = value.trim().replace(/[./]/g, "-");
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : "";
}

function toDisplayDate(value: string) {
  return value ? value.replaceAll("-", ".") : "";
}

function toDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateValue(year: number, month: number, day: number) {
  return [year, month + 1, day]
    .map((part) => String(part).padStart(2, "0"))
    .join("-");
}

export default function DateRangePicker({
  value,
  onChange,
}: DateRangePickerProps) {
  const [startValue = "", endValue = ""] = value.split("~");
  const startDate = toInputDate(startValue);
  const endDate = toInputDate(endValue);
  const [open, setOpen] = useState(false);
  const [draftStartDate, setDraftStartDate] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startDate ? toDate(startDate) : new Date()
  );
  const pickerRef = useRef<HTMLDivElement>(null);

  useClickOutside(pickerRef, () => {
    setOpen(false);
    setDraftStartDate("");
  });

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setDraftStartDate("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const dayCount = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: dayCount }, (_, index) => index + 1),
    ];
  }, [visibleMonth]);

  const selectedStartDate = draftStartDate || startDate;
  const selectedEndDate = draftStartDate ? "" : endDate;

  const handleDateClick = (date: string) => {
    if (!draftStartDate) {
      setDraftStartDate(date);
      return;
    }

    const nextStartDate = date < draftStartDate ? date : draftStartDate;
    const nextEndDate = date < draftStartDate ? draftStartDate : date;

    onChange(
      `${toDisplayDate(nextStartDate)} ~ ${toDisplayDate(nextEndDate)}`
    );
    setDraftStartDate("");
    setOpen(false);
  };

  const changeMonth = (offset: number) => {
    setVisibleMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1)
    );
  };

  return (
    <div ref={pickerRef} className="relative">
      <button
        type="button"
        aria-label="게시 요청 날짜 선택"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          if (!open) {
            setVisibleMonth(startDate ? toDate(startDate) : new Date());
          }
          setOpen(!open);
          setDraftStartDate("");
        }}
        className="grid min-h-[56px] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_24px] items-center gap-2 rounded-[6px] border border-Subbrown-4 bg-White px-3 text-left focus:outline-none focus:ring-2 focus:ring-primary-1/20 t:gap-4 t:px-4"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="hidden shrink-0 text-sm text-Gray-4 t:inline">시작일</span>
          <span className={startDate ? "text-Gray-7" : "text-Gray-3"}>
            {startDate ? toDisplayDate(startDate) : "날짜 선택"}
          </span>
        </span>

        <span aria-hidden="true" className="text-Gray-4">
          ~
        </span>

        <span className="flex min-w-0 items-center gap-2">
          <span className="hidden shrink-0 text-sm text-Gray-4 t:inline">종료일</span>
          <span className={endDate ? "text-Gray-7" : "text-Gray-3"}>
            {endDate ? toDisplayDate(endDate) : "날짜 선택"}
          </span>
        </span>

        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="text-Gray-7"
        >
          <path
            d="M7 3V6M17 3V6M4 9H20M5 5H19C19.5523 5 20 5.44772 20 6V20H4V6C4 5.44772 4.44772 5 5 5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="게시 기간 선택 달력"
          className="absolute right-0 z-50 mt-2 w-[320px] max-w-[calc(100vw-32px)] rounded-[10px] border border-Subbrown-4 bg-White p-4 shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="이전 달"
              className="flex h-8 w-8 items-center justify-center rounded-full text-Gray-6 hover:bg-Subbrown-5"
            >
              ‹
            </button>
            <strong className="body_1_2 text-Gray-7">
              {visibleMonth.getFullYear()}년 {visibleMonth.getMonth() + 1}월
            </strong>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="다음 달"
              className="flex h-8 w-8 items-center justify-center rounded-full text-Gray-6 hover:bg-Subbrown-5"
            >
              ›
            </button>
          </div>

          <p className="mb-3 text-center text-xs text-Gray-4">
            {draftStartDate
              ? "종료일을 선택해주세요."
              : "시작일과 종료일을 차례로 선택해주세요."}
          </p>

          <div className="grid grid-cols-7 text-center text-xs text-Gray-4">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday} className="py-1.5">
                {weekday}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <span key={`empty-${index}`} className="h-9" />;
              }

              const date = toDateValue(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth(),
                day
              );
              const isBoundary =
                date === selectedStartDate || date === selectedEndDate;
              const isInRange =
                selectedStartDate &&
                selectedEndDate &&
                date > selectedStartDate &&
                date < selectedEndDate;

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => handleDateClick(date)}
                  aria-pressed={isBoundary}
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                    isBoundary
                      ? "bg-primary-1 text-White"
                      : isInRange
                        ? "bg-Subbrown-5 text-Gray-7"
                        : "text-Gray-7 hover:bg-Subbrown-5"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
